'use client';

import LoadingAnimation from '@/app/components/LoadingAnimation';
import { getFullUserData } from '@/app/utils/actions/actionMethods';
import { getOrderHistory } from '@/app/utils/data/getUserInfo';
import { logs } from '@/app/utils/miniFunctions';
import { OrderHistoryProps } from '@/app/utils/schema/userProps';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { Fragment, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [orderHistory, setOrderHistory] = useState<OrderHistoryProps[]>([]);
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
      setUser(data);
    },
    onError: (error: { message: string[] }) => {
      logs.error('Error: ' + error.message);
    },
  });

  useEffect(() => {
    getUserDataFn.mutate();
  }, []);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h4 className="text-lg font-semibold mb-2">در حال بارگذاری ...</h4>
        <LoadingAnimation />
      </div>
    );
  }

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
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          {orderHistory.map((order) => (
            <motion.div
              key={order.id}
              className="p-4 bg-white shadow-lg rounded-xl border border-gray-200"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-sm text-gray-500 ">
                📅 تاریخ:{' '}
                {new Date(order.orderDate).toLocaleDateString('fa-IR')}
              </p>

              {order.items && order.items.length > 0 ? (
                <div className="mt-1 space-y-1">
                  {order.items.map((product) => (
                    <Fragment key={product.id + 'child'}>
                      <div className="flex items-center rounded-lg">
                        <Image
                          src={
                            product?.product?.basicInfo.mainImage.formats
                              .thumbnail.url
                          }
                          alt={product?.product.basicInfo.title}
                          width={
                            product?.product?.basicInfo.mainImage.formats
                              .thumbnail.width
                          }
                          height={
                            product?.product?.basicInfo.mainImage.formats
                              .thumbnail.height
                          }
                          className="w-full rounded-md"
                        />
                      </div>
                      <div>
                        <p className=" font-medium text-gray-700">
                          {product?.product?.basicInfo.title || 'بدون نام'}
                        </p>
                        <p className=" text-gray-500">
                          🛍️ تعداد: {product.count}
                        </p>
                      </div>
                    </Fragment>
                  ))}
                  <p
                    className={`text-sm font-semibold ${order.pay ? 'text-green-600' : 'text-red-500'}`}
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
    </div>
  );
}
