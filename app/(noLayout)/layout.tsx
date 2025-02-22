import type { Viewport } from 'next';
import localFont from 'next/font/local';
import '../globals.css';
import ClientProvider from '@/app/components/ClientProvider';

const iranFont = localFont({
  src: '../fonts/IRAN.woff',
});

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
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
