import type { Viewport } from 'next';
import '../globals.css';
import ClientProvider from '@/app/components/ClientProvider';

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
  return <ClientProvider>{children} </ClientProvider>;
}
