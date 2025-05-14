import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import FooterNavbar from './components/FooterNavbar';
import LoginHandler from './components/profile/LoginHandler';
import ClientProvider from './components/ClientProvider';
import { ToastContainer, Slide } from 'react-toastify';

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
        </ClientProvider>
      </body>
    </html>
  );
}
