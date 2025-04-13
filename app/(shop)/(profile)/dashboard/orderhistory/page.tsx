'use client';

import { useEffect, useState, Fragment } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getFullUserData } from '@/app/utils/actions/actionMethods';
import { getOrderHistory } from '@/app/utils/data/getUserInfo';
import { logs } from '@/app/utils/miniFunctions';
import { OrderHistoryProps } from '@/app/utils/schema/userProps';
import { useDataStore } from '@/app/utils/states/useUserdata';
import type { OrderDetailsModalProps } from '@/app/components/profile/OrderDetailsModal';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  cartProductSelector,
  cartProductSetter,
  varietyFinder,
} from '@/app/utils/shopUtils';
import { useCartStore } from '@/app/utils/states/useCartData';
import { cartProductsProps } from '@/app/utils/schema/shopProps';
import Modal from '@/app/components/Modal';

export default function OrderHistory() {
  const [orderHistory, setOrderHistory] = useState<OrderHistoryProps[]>([]);
  const [showModal, setShowModal] = useState(false);
  // const [selectedOrder, setSelectedOrder] = useState<
  //   OrderDetailsModalProps['order'] | null
  // >(null);
  const [productDetails, setProductDetails] = useState<
    {
      variety: {
        id: number;
        sub: number | null;
      };
      product: cartProductsProps;
      count: number;
      color: string;
      priceBefore: number;
      priceAfter: number;
      name: string;
    }[]
  >();
  const [loadingDetails, setLoadingDetails] = useState(false);

  const { user, setUser } = useDataStore();
  const { cartProducts, setCartProducts } = useCartStore();
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

  const handleOrderClick = async (order: OrderHistoryProps) => {
    setLoadingDetails(true);

    order.items.forEach(async (item) => {
      const productsList = await cartProductSetter(
        item.product.documentId,
        cartProducts
      );
      setCartProducts(productsList);
    });

    const details = Promise.all(
      order.items.map(async (item) => {
        const product = await cartProductSelector(
          item.product.documentId,
          cartProducts
        );
        const { color, priceBefforDiscount, mainPrice, specification } =
          varietyFinder(item.variety, product);
        return {
          variety: item.variety,
          product,
          count: item.count,
          color,
          priceBefore: priceBefforDiscount,
          priceAfter: mainPrice,
          name: specification,
        };
      })
    );
    setProductDetails(await details);
    setShowModal(true);
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
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        className="overflow-y-scroll"
      >
        <div>hello</div>
      </Modal>
      {/* {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          productDetails={productDetails}
          onClose={() => setSelectedOrder(null)}
        />
      )} */}
    </div>
  );
}
