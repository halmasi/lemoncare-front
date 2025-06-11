'use client';

import Link from 'next/link';
import { IoArrowBack, IoArrowForward } from 'react-icons/io5';

interface Props {
  pageCount: number;
  currentPage: number;
  query: string;
  className?: string;
  otherQueries?: string;
}

export default function Pagination({
  pageCount,
  currentPage,
  query,
  otherQueries,
  className,
}: Props) {
  const numbersArray = Array.from({ length: pageCount }, (_, i) => i + 1);

  const start = currentPage == 1 ? 0 : currentPage - 2;
  const end = currentPage + 1;

  return (
    <div
      className={`w-full items-center justify-center flex flex-row gap-2 ${className}`}
    >
      {currentPage != 1 && (
        <Link
          className={`flex items-center justify-center p-1 rounded-full h-7 aspect-square text-center text-background bg-gray-700`}
          href={`?${query}=${currentPage - 1}${otherQueries ? '&' + otherQueries : ''}`}
        >
          <IoArrowForward />
        </Link>
      )}
      {currentPage > 2 && (
        <div className="flex gap-1 items-center">
          <Link
            className={`flex items-center justify-center p-1 rounded-full h-7 aspect-square text-center text-background bg-gray-700`}
            href={`?${query}=1${otherQueries ? '&' + otherQueries : ''}`}
          >
            1
          </Link>
          {currentPage > 3 && <p>...</p>}
        </div>
      )}
      {numbersArray.slice(start, end).map((num, index) => {
        return (
          <Link
            className={` p-1 rounded-full h-7 aspect-square text-center text-background ${currentPage == num ? 'bg-accent-pink' : 'bg-gray-700'}`}
            href={`?${query}=${num}${otherQueries ? '&' + otherQueries : ''}`}
            key={index}
          >
            {num}
          </Link>
        );
      })}

      {currentPage < pageCount - 1 && pageCount > 4 && (
        <div className="flex gap-1 items-center">
          {currentPage < pageCount - 2 && <p>...</p>}
          <Link
            className={`flex items-center justify-center p-1 rounded-full h-7 aspect-square text-center text-background bg-gray-700`}
            href={`?${query}=${pageCount}${otherQueries ? '&' + otherQueries : ''}`}
          >
            {pageCount}
          </Link>
        </div>
      )}

      {currentPage != pageCount && (
        <Link
          className={`flex items-center justify-center p-1 rounded-full h-7 aspect-square text-center text-background bg-gray-700`}
          href={`?${query}=${currentPage + 1}${otherQueries ? '&' + otherQueries : ''}`}
        >
          <IoArrowBack />
        </Link>
      )}
    </div>
  );
}
