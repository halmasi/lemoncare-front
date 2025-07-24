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
import Link from 'next/link';
import { FaArrowRightLong } from 'react-icons/fa6';
import { RiArrowLeftSLine } from 'react-icons/ri';

function LoadingSkeleton({ times }: { times: number }) {
  const numbersArray = Array.from({ length: times }, (_, i) => i + 1);

  return (
    <div className="w-full flex flex-col gap-5">
      {numbersArray.map((i) => (
        <div
          key={i}
          className="w-full justify-between overflow-hidden flex flex-wrap gap-2 h-52 bg-gray-500 animate-pulse p-2 rounded-lg"
        >
          <div className="w-full flex items-center p-2 justify-around h-1/2">
            <div className="w-full flex flex-col justify-between h-full">
              <div className="w-[80%] h-5 bg-gray-300 rounded-lg" />
              <div className="w-[80%] h-5 bg-gray-300 rounded-lg" />
              <div className="w-[80%] h-5 bg-gray-300 rounded-lg" />
            </div>
            <RiArrowLeftSLine className="text-gray-300" />
          </div>
          <div className="w-full bg-gray-200 h-[1px]" />
          <div className="w-full flex h-1/2">
            <div
              className={`w-16 h-16 rounded-full aspect-square object-cover bg-gray-500 border-2`}
            />
            <div
              className={`w-16 h-16 rounded-full aspect-square object-cover bg-gray-400 border-2 -mr-8`}
            />
            <div
              className={`w-16 h-16 rounded-full aspect-square object-cover bg-gray-300 border-2 -mr-8`}
            />
            <div
              className={`w-16 h-16 rounded-full aspect-square object-cover bg-gray-200 border-2 -mr-8`}
            />
          </div>
        </div>
      ))}
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
      getOrderHistoryFn.mutate();
    }
  }, [user, page]);

  return (
    <div className="p-6 w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row w-full">
        <Link
          href={'/dashboard'}
          className="absolute hover:text-accent-pink self-start md:self-center md:justify-self-start transition-colors w-fit p-2 border-l"
        >
          <FaArrowRightLong />
        </Link>
        <div className="w-full flex flex-col items-center justify-center text-center mb-5">
          <Title className="flex flex-col items-center justify-center text-center mb-6">
            <h4 className=" text-accent-pink">سفارش های من</h4>
          </Title>
        </div>
      </div>

      {showLoading ? (
        <div className="w-full overflow-hidden">
          <LoadingSkeleton times={10} />
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
