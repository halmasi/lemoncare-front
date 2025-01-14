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
}: {
  href: string;
  children: ReactNode;
  label: string;
}) {
  return (
    <Link
      className="flex flex-col gap-1 h-full w-full items-center justify-center"
      href={href}
    >
      <div className="text-2xl">{children}</div>
      <p className="text-xs">{label}</p>
    </Link>
  );
}

export default function FooterNavbar() {
  const path = usePathname();
  return (
    <footer className="flex items-center justify-center bottom-0 sticky z-20 bg-white min-h-14 md:hidden border-t-2">
      <div className="flex w-full h-full justify-between">
        <Button href="/shop" label="محصولات">
          {path.startsWith('/shop') ? <RiApps2Fill /> : <RiApps2Line />}
        </Button>

        <Button href="/blog" label="مقالات">
          {path.startsWith('/blog') ? <RiArticleFill /> : <RiArticleLine />}
        </Button>

        <Button href="/cart" label="سبد خرید">
          {path.startsWith('/cart') ? (
            <RiShoppingBagFill />
          ) : (
            <RiShoppingBagLine />
          )}
        </Button>

        <Button href="/dashboard" label="حساب من">
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
