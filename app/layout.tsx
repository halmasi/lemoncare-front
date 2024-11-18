import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getMenuItems } from '@/utils/data/getMenu';
import {
  FooteritemsProps,
  SocialLinksProps,
  getFooterItems,
  getSocialLinksItems,
} from '@/utils/data/getFooter';

const iranFont = localFont({
  src: './fonts/IRAN.woff',
});

export const metadata: Metadata = {
  title: 'LemonCare - لمن کر',
  description: 'وبسایت تخصصی مراقبت از پوست و مو',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menuItems = await getMenuItems();
  const FooterMenu: FooteritemsProps[] = await getFooterItems();
  const SocialLinks: SocialLinksProps[] = await getSocialLinksItems();
  return (
    <html lang="fa">
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, minimum-scale=1"
      />
      <body className={`${iranFont.className} antialiased`}>
        <Navbar menuItems={menuItems} />
        <div className="flex bg-gray-50 relative z-10 justify-center">
          <div className="flex min-h-svh w-full justify-center">{children}</div>
        </div>
        <Footer FooterMenu={FooterMenu} SocialLinks={SocialLinks} />
      </body>
    </html>
  );
}
