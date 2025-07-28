'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import {
  RiAccountPinCircleLine,
  RiShoppingBagLine,
  RiArticleLine,
  RiApps2Line,
  RiAccountPinCircleFill,
  RiShoppingBagFill,
  RiArticleFill,
  RiApps2Fill,
} from 'react-icons/ri';

function Button({
  href,
  children,
  label,
  className = '',
}: {
  href: string;
  children: ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <Link
      className={`flex justify-center items-center h-full w-full border-x`}
      href={href}
    >
      <div
        className={`flex flex-col  justify-center items-center gap-1 w-[60%] ${className}`}
      >
        <div className="text-2xl">{children}</div>
        <p className="text-xs">{label}</p>
      </div>
    </Link>
  );
}

export default function FooterNavbar() {
  const path = usePathname();
  return (
    <footer className="flex items-center justify-center bottom-0 sticky z-20 bg-white min-h-14 lg:hidden border-t-2">
      <div className="flex w-full h-full justify-between">
        <Button
          href="/shop"
          className={`${path.startsWith('/shop') && 'bg-accent-pink text-white rounded-lg'}`}
          label="محصولات"
        >
          {path.startsWith('/shop') ? <RiApps2Fill /> : <RiApps2Line />}
        </Button>

        <Button
          href="/blog"
          className={`${path.startsWith('/blog') && 'bg-accent-pink text-white rounded-lg'}`}
          label="مقالات"
        >
          {path.startsWith('/blog') ? <RiArticleFill /> : <RiArticleLine />}
        </Button>

        <Button
          href="/cart"
          className={`${path.startsWith('/cart') && 'bg-accent-pink text-white rounded-lg'}`}
          label="سبد خرید"
        >
          {path.startsWith('/cart') ? (
            <RiShoppingBagFill />
          ) : (
            <RiShoppingBagLine />
          )}
        </Button>

        <Button
          href="/dashboard"
          className={`${path.startsWith('/dashboard') && 'bg-accent-pink text-white rounded-lg'}`}
          label="حساب من"
        >
          {path.startsWith('/dashboard') ? (
            <RiAccountPinCircleFill />
          ) : (
            <RiAccountPinCircleLine />
          )}
        </Button>
      </div>
    </footer>
  );
}
