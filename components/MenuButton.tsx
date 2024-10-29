'use client';
import Link from 'next/link';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { FaChevronDown } from 'react-icons/fa';

interface Props {
  children: ReactNode;
  slug: string;
  submenu: object[] | [];
}

export default function MenuButton({ children, slug, submenu }: Props) {
  const path = usePathname();

  return (
    <div
      className={`flex flex-row border-b items-center text-lg pb-2 mx-2 md:cursor-pointer ${
        (path.startsWith(slug) && slug !== '/') || path === slug
          ? 'bg-green-700 rounded-lg text-white md:border-yellow-800 md:text-black md:bg-transparent md:rounded-none'
          : 'border-yellow-500 rounded-none'
      }`}
    >
      <Link className="px-3" href={`/categories/${slug}`}>
        {children}
      </Link>
      {submenu && submenu.length > 0 && (
        <FaChevronDown className=" p-1 self-end" />
      )}
    </div>
  );
}
