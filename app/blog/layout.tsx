import '../globals.css';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/BlogFooter';
import { getMenuItems } from '@/app/utils/data/getMenu';
import {
  FooteritemsProps,
  SocialLinksProps,
  getFooterItems,
  getSocialLinksItems,
} from '@/app/utils/data/getMenu';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LemonCare - لمن کر',
  description:
    'وبسایت LemonCare با هدف ارائه‌ی اطلاعات تخصصی و علمی در حوزه مراقبت از پوست و مو طراحی شده است. این پلتفرم تلاش دارد تا با ارائه‌ی محتوای معتبر و به‌روز، نیازهای کاربران را در زمینه آگاهی از روش‌های صحیح مراقبت، محصولات بهداشتی، و راهکارهای پیشگیری و درمان برطرف کند.وبسایت تخصصی مراقبت از پوست و مو',
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
    <>
      <Navbar menuItems={menuItems} />
      <div className="flex bg-gray-50 relative z-10 justify-center">
        <div className="flex min-h-svh w-full justify-center">{children}</div>
      </div>
      <Footer FooterMenu={FooterMenu} SocialLinks={SocialLinks} />
    </>
  );
}
