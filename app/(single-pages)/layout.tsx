import Navbar from '@/components/Navbar';
import { getMenuItems, MenuProps } from '@/utils/data/getMenu';

export default async function SinglePagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menuItems: MenuProps[] = [
    { id: 0, image: null, subMenu: [], title: 'خانه', url: '/' },
    { id: 1, image: null, subMenu: [], title: 'فروشگاه', url: '/shop' },
    { id: 2, image: null, subMenu: [], title: 'مقالات', url: '/blog' },
  ];
  return (
    <>
      <Navbar menuItems={menuItems} />
      <div className="flex bg-gray-50 relative z-10 justify-center">
        <div className="flex min-h-svh w-full justify-center">{children}</div>
      </div>
    </>
  );
}
