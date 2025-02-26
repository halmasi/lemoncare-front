import type { Metadata } from 'next';
import '../globals.css';
import { getShopMenuItems } from '@/app/utils/data/getMenu';
import Navbar from '@/app/components/navbarComponents/Navbar';
import ClientProvider from '@/app/components/ClientProvider';
import GoogleScriptLoader from '../components/profile/GoogleScriptLoader';

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
    <ClientProvider>
      <GoogleScriptLoader />
      <Navbar menuItems={menuItems} />
      <div className="flex bg-background relative z-10 justify-center">
        <div className="flex min-h-svh w-full justify-center">{children}</div>
      </div>
    </ClientProvider>
  );
}
