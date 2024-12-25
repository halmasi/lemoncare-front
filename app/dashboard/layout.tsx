import Navbar from '@/app/components/Navbar';
import { MenuProps } from '@/app/utils/data/getMenu';
import React from 'react';

export default async function dashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menuItems: MenuProps[] = [
    { id: 0, title: 'مقاله ها', url: '/blog', subMenu: [], image: null },
    { id: 1, title: 'فروشگاه', url: '/shop', subMenu: [], image: null },
  ];
  return (
    <>
      <header>
        <Navbar menuItems={menuItems} />
        <div className="flex bg-gray-50 relative z-10 justify-center">
          <div className="flex min-h-svh w-full justify-center">{children}</div>
        </div>
      </header>
      <main></main>
    </>
  );
}
