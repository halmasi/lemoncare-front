'use client';

import { IoArrowBack, IoArrowForward } from 'react-icons/io5';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Props {
  pageCount: number;
  className?: string;
  query?: string;
}

export default function Pagination({
  pageCount,
  className,
  query = 'p',
}: Props) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const numbersArray = Array.from({ length: pageCount }, (_, i) => i + 1);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const currentCategories = params.get(query);
    setCurrentPage(parseInt(currentCategories || '1'));
  }, [searchParams]);

  const onClickFn = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set(query, pageNumber.toString());
    router.push(`?${params.toString()}`);
  };

  const start = currentPage == 1 ? 0 : currentPage - 2;
  const end = currentPage + 1;
  if (pageCount > 1)
    return (
      <div
        className={`w-full items-center justify-center flex flex-row gap-2 ${className}`}
      >
        {currentPage != 1 && (
          <div
            className={`flex items-center justify-center p-1 rounded-lg h-7 aspect-square text-center text-background bg-gray-500 cursor-pointer`}
            onClick={() => {
              onClickFn(currentPage - 1);
            }}
          >
            <IoArrowForward />
          </div>
        )}
        {currentPage > 2 && (
          <div className="flex gap-1 items-center">
            <div
              className={`flex items-center justify-center p-1 rounded-full h-7 aspect-square text-center text-background bg-gray-700 cursor-pointer`}
              onClick={() => {
                onClickFn(1);
              }}
            >
              <p className="text-sm">1</p>
            </div>
            {currentPage > 3 && <p>...</p>}
          </div>
        )}
        {numbersArray.slice(start, end).map((num, index) => {
          return (
            <div
              className={`cursor-pointer p-1 rounded-full h-7 aspect-square text-center text-background ${currentPage == num ? 'bg-accent-pink' : 'bg-gray-700'}`}
              onClick={() => {
                if (currentPage != num) onClickFn(num);
              }}
              key={index}
            >
              <p className="text-sm">{num}</p>
            </div>
          );
        })}

        {currentPage < pageCount - 1 && pageCount > 3 && (
          <div className="flex gap-1 items-center">
            {currentPage < pageCount - 2 && <p>...</p>}
            <div
              className={`cursor-pointer flex items-center justify-center p-1 rounded-full h-7 aspect-square text-center text-background bg-gray-700`}
              onClick={() => {
                onClickFn(pageCount);
              }}
            >
              <p className="text-sm">{pageCount}</p>
            </div>
          </div>
        )}

        {currentPage != pageCount && (
          <div
            className={` cursor-pointer flex items-center justify-center p-1 rounded-lg h-7 aspect-square text-center text-background bg-gray-500`}
            onClick={() => {
              onClickFn(currentPage + 1);
            }}
          >
            <IoArrowBack />
          </div>
        )}
      </div>
    );
}
