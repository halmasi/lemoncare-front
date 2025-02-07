import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import FooterNavbar from './components/FooterNavbar';
import { ApolloProvider } from '@apollo/client';
import client from '@/app/utils/apolloClient';

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
        <ApolloProvider client={client}>
          {children}
          <FooterNavbar />
        </ApolloProvider>
      </body>
    </html>
  );
}
