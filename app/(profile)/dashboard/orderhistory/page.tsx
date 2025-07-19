'use client';

import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getOrderHistory } from '@/app/utils/data/getUserInfo';
import { OrderHistoryProps } from '@/app/utils/schema/userProps';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { useSearchParams } from 'next/navigation';
import Pagination from '@/app/components/Pagination';
import OrderHistoryCard from '@/app/components/profile/OrderHistoryCard';
import Title from '@/app/components/Title';

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
      <Title className="mb-6">
        <h4 className=" text-accent-pink">سفارش های من</h4>
      </Title>
      {showLoading ? (
        <div className="w-full overflow-hidden">
          <LoadingSkeleton />
        </div>
      ) : orderHistory && orderHistory.length > 0 ? (
        <div className="flex flex-col gap-5">
          {orderHistory.map((item) => (
            <OrderHistoryCard item={item} key={item.order.id} />
          ))}
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
