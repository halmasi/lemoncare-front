import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import ClientProvider from './components/ClientProvider';
import { ToastContainer, Slide } from 'react-toastify';
import config from '@/app/utils/config';
import Footer from '@/app/components/Footer';
import FooterNavbar from './components/FooterNavbar';
import LoginHandler from './components/profile/LoginHandler';
import {
  getFooterItems,
  getMenuItems,
  getShopMenuItems,
  getSocialLinksItems,
} from '@/app/utils/data/getMenu';
import {
  FooteritemsProps,
  SocialLinksProps,
} from '@/app/utils/schema/menuProps';
import Navbar from './components/navbarComponents/Navbar';

const iranFont = localFont({
  src: './fonts/IRAN.woff',
});

export const metadata: Metadata = {
  title: 'lemiro - لمیرو',
  description: 'وبسایت تخصصی مراقبت از پوست و مو',
  openGraph: {
    title: 'lemiro - لمیرو',
    description: 'وبسایت تخصصی مراقبت از پوست و مو',
    siteName: 'lemiro - لمیرو',
    images: [
      {
        url: `${config.siteUrl}/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FlemoncareLogoForHeader.29327b2f.png`,
        width: 1200,
        height: 630,
        alt: 'lemiro - لمیرو',
      },
    ],
  },
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
  const blogMenu = await getMenuItems();
  const shopMenu = await getShopMenuItems();

  return (
    <html lang="fa">
      <body className={`${iranFont.className} antialiased min-h-svh`}>
        <ClientProvider>
          <LoginHandler />

          <Navbar blog={blogMenu} shop={shopMenu} />
          <div className="flex bg-background relative z-10 justify-center">
            <div className="flex min-h-svh w-full justify-center">
              {children}
            </div>
          </div>

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
