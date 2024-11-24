import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '../globals.css';

const iranFont = localFont({
  src: '../fonts/IRAN.woff',
});

export const metadata: Metadata = {
  title: 'LemonCare shop - قروشگاه لمن کر',
  description: 'فروشگاه تخصصی مراقبت از پوست و مو',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex bg-gray-50 relative z-10 justify-center">
      <div className="flex min-h-svh w-full justify-center">{children}</div>
    </div>
  );
}
