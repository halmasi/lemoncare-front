'use client';

import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getOrderHistory } from '@/app/utils/data/getUserInfo';
import { OrderHistoryProps } from '@/app/utils/schema/userProps';
import { useDataStore } from '@/app/utils/states/useUserdata';
import Image from 'next/image';
import Link from 'next/link';
import SubmitButton from '@/app/components/formElements/SubmitButton';
import { useSearchParams } from 'next/navigation';
import Pagination from '@/app/components/Pagination';
import { toast } from 'react-toastify';

function LoadingSkeleton() {
  return (
    <div className="w-full justify-between overflow-hidden flex flex-wrap gap-2 h-52 bg-gray-500 animate-pulse p-2">
      <div className="p-2 h-full w-40 bg-gray-300 rounded-lg"></div>
      <div className="p-2 h-full w-40 bg-gray-300 rounded-lg"></div>
      <div className="p-2 h-full w-40 bg-gray-300 rounded-lg"></div>
      <div className="p-2 h-full w-40 bg-gray-300 rounded-lg"></div>
      <div className="p-2 h-full w-40 bg-gray-300 rounded-lg"></div>
    </div>
  );
}

export default function OrderHistory() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('p') || '1');

  const [showLoading, setShowLoading] = useState<boolean>(true);
  const [orderHistory, setOrderHistory] = useState<OrderHistoryProps[]>([]);
  const [pageCount, setPageCount] = useState<number>(1);
  const { user } = useDataStore();

  const getOrderHistoryFn = useMutation({
    mutationFn: async () => {
      setShowLoading(true);

      const orderHistory = await getOrderHistory(page, 10);
      return orderHistory;
    },
    onSuccess: (data) => {
      setOrderHistory(data.data);
      setPageCount(parseInt(data.meta.pagination.pageCount));
      setShowLoading(false);
    },
    onError: () => {
      toast.warn('خطایی رخ داده');
      setShowLoading(false);
    },
  });

  useEffect(() => {
    if (user) {
      getOrderHistoryFn.mutateAsync();
    }
  }, [user, page]);

  return (
    <div className="p-6 w-full max-w-4xl mx-auto">
      <h4 className=" mb-6 text-accent-green">لیست سفارشات</h4>

      {showLoading ? (
        <div className="w-full overflow-hidden">
          <LoadingSkeleton />
        </div>
      ) : orderHistory.length > 0 ? (
        <div className="flex flex-col gap-5">
          {orderHistory.map((item) => {
            const order = item.order;
            return (
              <Link
                href={`/dashboard/orderhistory/${order.orderCode}`}
                key={order.id}
                className="gap-2 p-4 bg-white shadow-md hover:shadow-lg rounded-lg border transition-all duration-200 cursor-pointer space-y-2"
              >
                {order.items && order.items.length > 0 ? (
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-500">
                      تاریخ:{' '}
                      {new Date(order.orderDate).toLocaleDateString('fa-IR')}
                    </p>
                    <div className="flex flex-row mt-1 gap-3">
                      {order.items.map((product) => (
                        <div key={product.id}>
                          <div className="flex flex-col sm:flex-row gap-3">
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
                              تعداد: {product.count}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div
                      className={`text-sm w-full flex flex-wrap justify-between items-center gap-2`}
                    >
                      <p>
                        <span className="text-gray-500">وضعیت پرداخت: </span>
                        <span
                          className={`font-semibold ${
                            order.paymentStatus == 'completed'
                              ? 'text-accent-green/75'
                              : 'text-accent-pink/75'
                          }`}
                        >
                          {order.paymentStatus == 'completed'
                            ? 'پرداخت شده'
                            : order.paymentStatus == 'pending'
                              ? 'در انتظار پرداخت'
                              : 'لغو شده'}
                        </span>
                      </p>
                      <div className="self-end w-fit">
                        <SubmitButton>مشاهده سفارش</SubmitButton>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 mt-2 text-sm">
                    هیچ محصولی در این سفارش یافت نشد.
                  </p>
                )}
              </Link>
            );
          })}
          {pageCount > 1 && (
            <Pagination
              currentPage={page}
              pageCount={pageCount}
              key={pageCount}
              query={'p'}
            />
          )}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-6">هیچ سفارشی یافت نشد.</p>
      )}

      <div className="flex flex-row">{}</div>
    </div>
  );
}
