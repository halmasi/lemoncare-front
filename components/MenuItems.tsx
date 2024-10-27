import MenuButton from './MenuButton';

const menuItems: Props[] = [
  { id: 0, href: '/', title: 'خانه', subMenu: false },
  { id: 1, href: '/skincare', title: 'پوست', subMenu: false },
  { id: 2, href: '/haircare', title: 'مو', subMenu: true },
];

interface Props {
  id: number;
  href: string;
  title: string;
  subMenu: boolean;
}

async function getMenuItems() {
  // const menuItemsPath = process.env.BACKEND_PATH + '/categories';
  // console.log(await fetch('https://google.com'));
}

export default function MenuItems() {
  return (
    <>
      {menuItems.map((item) => (
        <MenuButton key={item.id} href={item.href} submenu={item.subMenu}>
          {item.title}
        </MenuButton>
      ))}
    </>
  );
}
