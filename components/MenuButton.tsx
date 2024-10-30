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
      className={`flex w-full flex-row border-b items-center text-sm p-2 md:cursor-pointer transition-colors duration-150 md:mx-3 ${
        (path.startsWith(slug) && slug !== '/') || path === slug
          ? 'bg-green-700 rounded-lg text-white md:border-green-700 md:text-black md:bg-transparent md:rounded-none'
          : 'border-yellow-500 rounded-none hover:border-yellow-800'
      }`}
    >
      <Link className="" href={slug}>
        {children}
      </Link>
      {submenu && submenu.length > 0 && (
        <FaChevronDown className=" p-1 self-end" />
      )}
    </div>
  );
}
