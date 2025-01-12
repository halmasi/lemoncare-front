'use client';
import Link from 'next/link';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { FaChevronDown } from 'react-icons/fa';
import { motion, transform } from 'framer-motion';

interface Props {
  children: ReactNode;
  slug: string;
  isClicked?: boolean;
  submenu: object[] | [];
  func?: () => void;
}

export default function MenuButton({
  children,
  slug,
  submenu,
  func,
  isClicked,
}: Props) {
  const path = usePathname();
  transform([0, 100], [0, 360]);
  return (
    <div
      className={`flex w-full md:w-fit flex-row border-b items-center text-sm p-2 md:cursor-pointer transition-colors duration-150 md:mx-3 ${
        (path.startsWith(slug) && slug !== '/') || path === slug
          ? 'bg-accent-green rounded-lg text-white md:border-accent-green md:text-black md:bg-transparent md:rounded-none'
          : path.startsWith('/shop')
            ? 'border-accent-pink rounded-none hover:border-pink-800'
            : 'border-accent-yellow rounded-none hover:border-yellow-800'
      }`}
    >
      <Link
        onClick={func}
        className={`${(!submenu || submenu.length == 0) && 'w-full'}`}
        href={slug}
      >
        {children}
      </Link>
      {submenu && submenu.length > 0 && (
        <motion.div
          animate={{
            rotate: isClicked ? 180 : 0,
          }}
          transition={{
            duration: 0.3,
            ease: 'easeInOut',
          }}
        >
          <FaChevronDown className=" p-1 self-end text-lg" />
        </motion.div>
      )}
    </div>
  );
}
