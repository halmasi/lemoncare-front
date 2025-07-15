'use client';

import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getOrderHistory } from '@/app/utils/data/getUserInfo';
import { OrderHistoryProps } from '@/app/utils/schema/userProps';
import { useDataStore } from '@/app/utils/states/useUserdata';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Pagination from '@/app/components/Pagination';
import { toast } from 'react-toastify';
import { RiArrowLeftSLine } from 'react-icons/ri';
import Toman from '@/app/components/Toman';

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
      ) : orderHistory && orderHistory.length > 0 ? (
        <div className="flex flex-col gap-5">
          {orderHistory.map((item) => {
            const order = item.order;
            return (
              <Link
                href={`/dashboard/orderhistory/${order.orderCode}`}
                key={order.id}
                className="w-full gap-2 p-4 bg-white shadow-md hover:shadow-lg rounded-lg border transition-all duration-200 cursor-pointer space-y-2"
              >
                {order.items && order.items.length > 0 ? (
                  <div className="w-full flex flex-col">
                    <div className="w-full flex justify-between border-b">
                      <div>
                        <div
                          className={`text-sm w-full flex flex-wrap items-center gap-1 p-1`}
                        >
                          <div className="flex flex-wrap p-2 gap-2 text-sm">
                            <p className="text-gray-500">
                              {new Date(order.orderDate).toLocaleDateString(
                                'fa-IR'
                              )}
                            </p>
                          </div>
                          <div className="flex flex-wrap p-2 gap-2 text-sm ">
                            <p className="text-gray-500">وضعیت پرداخت: </p>
                            <p
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
                            </p>
                          </div>
                          <div className="flex flex-wrap p-2 gap-2 text-sm ">
                            <p className="text-gray-500">شناسه سفارش: </p>
                            <p>{order.orderCode}</p>
                          </div>
                        </div>
                        <div
                          className={`text-sm w-full flex flex-wrap items-center gap-1 p-1`}
                        >
                          <div className="flex flex-wrap p-2 gap-2 text-sm ">
                            <p className="text-gray-500">مبلغ: </p>
                            <Toman className="fill-accent-green text-accent-green">
                              <p>
                                {(order.totalPrice / 10).toLocaleString(
                                  'fa-IR'
                                )}
                              </p>
                            </Toman>
                          </div>
                          <div className="flex flex-wrap p-2 gap-2 text-sm ">
                            <p className="text-gray-500">تخفیف: </p>
                            <Toman className="fill-accent-green text-accent-green">
                              <p>
                                {(() => {
                                  let offer = 0;
                                  order.items.forEach((item) => {
                                    if (item.beforePrice && item.mainPrice)
                                      offer +=
                                        item.beforePrice - item.mainPrice;
                                  });
                                  return (
                                    <span>
                                      {(
                                        (order.orderPrice - offer) /
                                        10
                                      ).toLocaleString('fa-IR')}
                                    </span>
                                  );
                                })()}
                              </p>
                            </Toman>
                          </div>
                        </div>
                      </div>
                      <p className="self-center p-2 w-fit hover:text-accent-pink transition-colors">
                        <RiArrowLeftSLine />
                      </p>
                    </div>
                    <div className="w-full flex flex-row mt-1 gap-3 p-1">
                      {(() => {
                        const i = order.items.slice(0, 4);
                        return i.map((product, index) => (
                          <Image
                            key={product.id}
                            src={
                              product?.product?.basicInfo?.mainImage?.formats
                                ?.thumbnail?.url || '/placeholder.png'
                            }
                            alt={
                              product?.product?.basicInfo?.title || 'بدون نام'
                            }
                            width={100}
                            height={100}
                            className={`w-16 h-26 rounded-full aspect-square object-cover border-background border-2 ${index > 0 && '-mr-8'}`}
                          />
                        ));
                      })()}
                      {order.items.length > 4 && (
                        <div className="flex items-center justify-center w-16 h-16 rounded-full aspect-square object-cover border-2 bg-background/85 -mr-8">
                          <p>{order.items.length - 4}+</p>
                        </div>
                      )}
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
