import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import FooterNavbar from './components/FooterNavbar';

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
  return (
    <html lang="fa">
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, minimum-scale=1"
      />
      <body className={`${iranFont.className} antialiased`}>
        {children} <FooterNavbar />
      </body>
    </html>
  );
}
