import '../globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getMenuItems } from '@/utils/data/getMenu';
import {
  FooteritemsProps,
  SocialLinksProps,
  getFooterItems,
  getSocialLinksItems,
} from '@/utils/data/getFooter';

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
