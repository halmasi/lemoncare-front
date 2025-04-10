'use client';

import { useEffect, useState, Fragment } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getFullUserData } from '@/app/utils/actions/actionMethods';
import { getOrderHistory } from '@/app/utils/data/getUserInfo';
import { logs } from '@/app/utils/miniFunctions';
import { OrderHistoryProps } from '@/app/utils/schema/userProps';
import { useDataStore } from '@/app/utils/states/useUserdata';
import OrderDetailsModal from '@/app/components/profile/OrderDetailsModal';
import { getProducts } from '@/app/utils/data/getProducts';
import type { OrderDetailsModalProps } from '@/app/components/profile/OrderDetailsModal';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function OrderHistory() {
  const [orderHistory, setOrderHistory] = useState<OrderHistoryProps[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<
    OrderDetailsModalProps['order'] | null
  >(null);
  const [productDetails, setProductDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const { user, setUser } = useDataStore();

  const getUserDataFn = useMutation({
    mutationFn: async () => {
      const res = await getFullUserData();
      return res.body;
    },
    onSuccess: async (data) => {
      const orderHistoryData = await getOrderHistory(
        data.order_history.documentId
      );
      setOrderHistory(orderHistoryData.data.order || []);
      console.log('Order History Information:', orderHistoryData);
      setUser(data);
    },
    onError: (error: { message: string[] }) => {
      logs.error('Error: ' + error.message);
    },
  });

  useEffect(() => {
    if (!user) {
      getUserDataFn.mutate();
    }
  }, [user]); // Added `user` as a dependency

  const fetchProductDetails = async (order: OrderHistoryProps) => {
    try {
      const contentCodes = order.items
        ?.map((item) => item.product?.basicInfo?.contentCode)
        .filter(Boolean);

      if (contentCodes && contentCodes.length > 0) {
        const fetchedProducts = await Promise.all(
          contentCodes.map((code) => getProducts(code))
        );
        return fetchedProducts.flat();
      }
      return [];
    } catch (error) {
      logs.error('Error fetching product details: ' + error);
      return [];
    }
  };

  const handleOrderClick = async (order: OrderHistoryProps) => {
    setLoadingDetails(true);

    try {
      // Transform the order to match the expected structure
      const transformedOrder = {
        ...order,
        items: order.items.map((item) => ({
          ...item,
          variety: {
            id: String(item.variety.id), // Convert `id` to string
            sub: item.variety.sub ? String(item.variety.sub) : null, // Convert `sub` to string if it exists
          },
          product: {
            ...item.product,
            variety: Array.isArray(item.product.variety) // Check if `variety` exists and is an array
              ? item.product.variety.map((v) => ({
                  ...v,
                  uniqueId: String(v.uniqueId), // Convert `uniqueId` to string
                  subVariety: Array.isArray(v.subVariety) // Check if `subVariety` exists and is an array
                    ? v.subVariety.map((sv) => ({
                        ...sv,
                        uniqueId: String(sv.uniqueId), // Convert `subVariety.uniqueId` to string
                      }))
                    : [], // Default to an empty array if `subVariety` is undefined
                }))
              : [], // Default to an empty array if `variety` is undefined
          },
        })),
      };

      setSelectedOrder(transformedOrder as OrderDetailsModalProps['order']);
      console.log('selectedOrder:', transformedOrder);

      const details = await fetchProductDetails(order);
      setProductDetails(details);
    } catch (error) {
      logs.error('Error fetching product details: ' + error);
    } finally {
      setLoadingDetails(false);
    }
  };
  return (
    <div className="p-6 w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        🛒 آخرین سفارشات
      </h2>

      {getUserDataFn.isPending ? (
        <div className="w-full h-52 bg-gray-500 animate-pulse p-2">
          <div className="p-2 h-full w-40 bg-gray-300 rounded-lg"></div>
        </div>
      ) : orderHistory.length > 0 ? (
        <div>
          {orderHistory.map((order) => (
            <motion.div
              key={order.id}
              className="p-4 bg-white shadow-lg rounded-xl border border-gray-200 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => handleOrderClick(order)}
            >
              {order.items && order.items.length > 0 ? (
                <div className="flex flex-col">
                  <p className="text-sm text-gray-500">
                    📅 تاریخ:{' '}
                    {new Date(order.orderDate).toLocaleDateString('fa-IR')}
                  </p>
                  <div className="flex flex-row mt-1 gap-3">
                    {order.items.map((product) => (
                      <div key={product.id}>
                        <div className="flex items-center rounded-lg">
                          <Image
                            src={
                              product?.product?.basicInfo?.mainImage?.formats
                                ?.thumbnail?.url || '/placeholder.png'
                            }
                            alt={
                              product?.product?.basicInfo?.title || 'بدون نام'
                            }
                            width={100}
                            height={100}
                            className="rounded-md"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">
                            {product?.product?.basicInfo?.title || 'بدون نام'}
                          </p>
                          <p className="text-gray-500">
                            🛍️ تعداد: {product.count}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p
                    className={`text-sm font-semibold ${
                      order.pay ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    💳 وضعیت پرداخت:{' '}
                    {order.pay ? 'پرداخت شده' : 'در انتظار پرداخت'}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 mt-2 text-sm">
                  هیچ محصولی در این سفارش یافت نشد.
                </p>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-6">هیچ سفارشی یافت نشد.</p>
      )}

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          productDetails={productDetails}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
