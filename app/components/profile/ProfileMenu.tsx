'use client';

import { logoutAction } from '@/app/utils/actions/actionMethods';
import { useCartStore } from '@/app/utils/states/useCartData';
import { useCheckoutStore } from '@/app/utils/states/useCheckoutData';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ReactNode } from 'react';
import {
  FaShoppingCart,
  FaRegHeart,
  FaMapMarkerAlt,
  FaUser,
  FaSignOutAlt,
  FaReceipt,
} from 'react-icons/fa';

interface MenuItemsProps {
  name: string | ReactNode;
  icon?: ReactNode;
  key: string;
  url?: string;
}

export default function ProfileMenu({
  extraItems,
}: {
  extraItems?: { items: MenuItemsProps[]; position: 'top' | 'bottom' }[];
}) {
  const { resetUser } = useDataStore();
  const { resetCart } = useCartStore();
  const { resetCheckout } = useCheckoutStore();

  const logoutFn = useMutation({
    mutationFn: async () => {
      resetUser();
      resetCart();
      resetCheckout();
      await logoutAction();
    },
  });
  const defaultItems: MenuItemsProps[] = [
    {
      name: <p>سبد خرید</p>,
      icon: <FaShoppingCart />,
      key: 'cart',
      url: '/cart',
    },
    {
      name: <p>سفارش‌ها</p>,
      icon: <FaReceipt />,
      key: 'orders',
      url: `/dashboard/orderhistory`,
    },
    { name: <p>مالی</p>, icon: <FaUser />, key: 'finance' },
    { name: <p>آدرس‌ها</p>, icon: <FaMapMarkerAlt />, key: 'addresses' },
    { name: <p>علاقه‌مندی‌ها</p>, icon: <FaRegHeart />, key: 'favorites' },
    {
      name: <p>اطلاعات حساب کاربری</p>,
      icon: <FaUser />,
      key: 'profile',
      url: '/dashboard/information',
    },
  ];

  let menuItems: MenuItemsProps[] = [];

  if (extraItems) {
    extraItems.map((item) => {
      if (item.position == 'top') {
        menuItems = [...menuItems, ...item.items];
      }
    });
    defaultItems.map((item) => {
      menuItems.push(item);
    });
    extraItems.map((item) => {
      if (item.position == 'bottom') {
        item.items.map((singleItem) => menuItems.push(singleItem));
      }
    });
  } else menuItems = defaultItems;

  return (
    <>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <motion.div
            key={item.key}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-200 rounded-lg"
          >
            {item.icon}
            <Link className="w-full" href={item.url || '/dashboard'}>
              {item.name}
            </Link>
          </motion.div>
        ))}
      </nav>
      <form
        action={() => {
          logoutFn.mutate();
        }}
        className="mt-6"
      >
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          <FaSignOutAlt /> خروج از حساب کاربری
        </button>
      </form>
    </>
  );
}
