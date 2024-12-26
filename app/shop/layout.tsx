import type { Metadata } from 'next';
import '../globals.css';
import { getShopMenuItems } from '@/app/utils/data/getMenu';
import Navbar from '@/app/components/Navbar';

export const metadata: Metadata = {
  title: 'LemonCare shop - قروشگاه لمن کر',
  description: 'فروشگاه تخصصی مراقبت از پوست و مو',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menuItems = await getShopMenuItems();
  return (
    <>
      <header>
        <Navbar menuItems={menuItems} />
      </header>
      <div className="flex bg-gray-50 relative z-10 justify-center pt-3">
        <div className="flex min-h-svh w-full justify-center">{children}</div>
      </div>
    </>
  );
}
