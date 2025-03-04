'use client';

import LoadingAnimation from '@/app/components/LoadingAnimation';
import { getFullUserData } from '@/app/utils/actions/actionMethods';
import { getOrderHistory } from '@/app/utils/data/getUserInfo';
import { OrderHistoryProps } from '@/app/utils/schema/userProps';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [orderHistory, setOrderHistory] = useState<OrderHistoryProps[]>([]);
  const { user, setUser } = useDataStore();

  const getUserDataFn = useMutation({
    mutationFn: async () => {
      const res = await getFullUserData();
      console.log('FROM ORDER HISTORY PAGE 1 : ', res.body.order_history.order);
      return res.body;
    },
    onSuccess: async (data) => {
      const orderHistoryData = await getOrderHistory(
        data.order_history.documentId
      );
      console.log('order output : ', orderHistoryData);
      setOrderHistory(orderHistoryData.data.order || []);
      setUser(data);
    },
    onError: (error: { message: string[] }) => {
      console.error('Error:', error.message);
    },
  });

  useEffect(() => {
    getUserDataFn.mutate();
  }, []);
  orderHistory.map((Item) => {
    console.log('Map output : ', Item.items);
  });
  if (!user) {
    return (
      <div>
        <h4>در حال بارگزاری ...</h4>
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <div className="p-6 w-full">
      <h2>آخرین سفارش</h2>
      {getUserDataFn.isPending ? (
        <div className="w-full h-52 bg-gray-500 animate-pulse p-2">
          <div className="p-2 h-full w-40 bg-gray-300 rounded-lg"></div>
        </div>
      ) : orderHistory.length > 0 ? (
        orderHistory.map((order) => (
          <div key={order.id} className="border-b p-4">
            {order.items && order.items.length > 0 ? (
              order.items.map((product) => (
                <>
                  <div key={product.id} className="p-2">
                    <Image
                      src={
                        product?.product?.basicInfo.mainImage.formats.thumbnail
                          .url
                      }
                      alt={product?.product.basicInfo.title}
                      width={
                        product?.product?.basicInfo.mainImage.formats.thumbnail
                          .width
                      }
                      height={
                        product?.product?.basicInfo.mainImage.formats.thumbnail
                          .height
                      }
                    />
                    <strong>
                      {product?.product?.basicInfo.title || 'بدون نام'}
                    </strong>
                  </div>
                  <p>تعداد : {product.count}</p>
                </>
              ))
            ) : (
              <p className="text-gray-500">هیچ محصولی در این سفارش یافت نشد.</p>
            )}

            <p>
              تاریخ سفارش:{' '}
              {new Date(order.orderDate).toLocaleDateString('fa-IR')}
            </p>
            <p>وضعیت پرداخت: {order.pay ? 'پرداخت شده' : 'در انتظار پرداخت'}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">هیچ سفارشی یافت نشد.</p>
      )}
    </div>
  );
}
