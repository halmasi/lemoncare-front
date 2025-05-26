import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import ClientProvider from './components/ClientProvider';
import { ToastContainer, Slide } from 'react-toastify';

import Footer from '@/app/components/BlogFooter';
import FooterNavbar from './components/FooterNavbar';
import LoginHandler from './components/profile/LoginHandler';
import { getFooterItems, getSocialLinksItems } from '@/app/utils/data/getMenu';
import {
  FooteritemsProps,
  SocialLinksProps,
} from '@/app/utils/schema/menuProps';

const iranFont = localFont({
  src: './fonts/IRAN.woff',
});

export const metadata: Metadata = {
  title: 'LemonCare - لمن کر',
  description: 'وبسایت تخصصی مراقبت از پوست و مو',
};

export const viewport: Viewport = {
  themeColor: '#000000',
  initialScale: 1,
  width: 'device-width',
  minimumScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const FooterMenu: FooteritemsProps[] = await getFooterItems();
  const SocialLinks: SocialLinksProps[] = await getSocialLinksItems();

  return (
    <html lang="fa">
      <body className={`${iranFont.className} antialiased min-h-svh`}>
        <ClientProvider>
          <LoginHandler />
          {children}
          <FooterNavbar />
          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition={Slide}
          />

          <Footer FooterMenu={FooterMenu} SocialLinks={SocialLinks} />
        </ClientProvider>
      </body>
    </html>
  );
}
