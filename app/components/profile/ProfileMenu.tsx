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
  FaBookmark,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import SubmitButton from '../formElements/SubmitButton';
import { usePathname, useRouter } from 'next/navigation';
import { useLoginData } from '@/app/utils/states/useLoginData';
import { BsHeartFill } from 'react-icons/bs';

interface MenuItemsProps {
  name: string | ReactNode;
  title: string;
  icon?: ReactNode;
  key: string;
  url?: string;
}

export default function ProfileMenu({
  extraItems,
  compact = false,
}: {
  extraItems?: { items: MenuItemsProps[]; position: 'top' | 'bottom' }[];
  compact?: boolean;
}) {
  const { resetUser } = useDataStore();
  const { resetCart } = useCartStore();
  const { resetCheckout } = useCheckoutStore();
  const { setStep } = useLoginData();
  const { push } = useRouter();
  const path = usePathname();

  const logoutFn = useMutation({
    mutationFn: async () => {
      await logoutAction();
      resetUser();
      resetCart();
      resetCheckout();
      setStep('identifier');
      if (path.startsWith('/dashboard') || path.startsWith('/cart')) {
        push('/login');
      }
    },
    onError: () => {
      toast.error('خطا در خروج از حساب کاربری');
    },
  });
  const defaultItems: MenuItemsProps[] = [
    {
      name: <p>سبد خرید</p>,
      title: 'سبد خرید',
      icon: <FaShoppingCart />,
      key: 'cart',
      url: '/cart',
    },
    {
      name: <p>سفارش‌ها</p>,
      title: 'سفارش‌ها',
      icon: <FaReceipt />,
      key: 'orders',
      url: `/dashboard/orderhistory`,
    },
    // { name: <p>مالی</p>, title: 'مالی', icon: <FaUser />, key: 'finance' },
    {
      name: <p>آدرس‌ها</p>,
      title: 'آدرس‌ها',
      icon: <FaMapMarkerAlt />,
      key: 'addresses',
      url: '/dashboard/addresses',
    },
    {
      name: <p>محصولات مورد علاقه</p>,
      title: 'محصولات مورد علاقه',
      icon: <BsHeartFill />,
      key: 'favorites',
      url: '/dashboard/favorites',
    },
    {
      name: <p>مقالات نشان شده</p>,
      title: 'مقالات نشان شده',
      icon: <FaBookmark />,
      key: 'bookmarks',
      url: '/dashboard/bookmarks',
    },
    {
      name: <p>اطلاعات حساب کاربری</p>,
      title: 'اطلاعات حساب کاربری',
      icon: <FaUser />,
      key: 'profile',
      url: '/dashboard/information',
    },
  ];

  let menuItems: MenuItemsProps[] = [];

  if (extraItems) {
    extraItems.forEach((item) => {
      if (item.position == 'top') {
        menuItems = [...menuItems, ...item.items];
      }
    });
    defaultItems.forEach((item) => {
      menuItems.push(item);
    });
    extraItems.forEach((item) => {
      if (item.position == 'bottom') {
        item.items.map((singleItem) => menuItems.push(singleItem));
      }
    });
  } else menuItems = defaultItems;

  return (
    <>
      <nav className="mt-6">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.key + index}
            whileHover={{ scale: 1.05 }}
            className={`flex items-center gap-3 p-3 cursor-pointer  rounded-lg ${path == item.url ? 'bg-accent-pink/10' : 'hover:bg-gray-200'} transition-colors`}
          >
            <Link
              title={item.title}
              className="w-full flex gap-2 items-center min-h-6"
              href={path == item.url ? '' : item.url || '/dashboard'}
            >
              <span>{item.icon}</span>
              {!compact && <span className="w-full">{item.name}</span>}
            </Link>
          </motion.div>
        ))}
      </nav>

      <SubmitButton
        onClick={() => {
          logoutFn.mutate();
        }}
        className="mt-6 w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-800 text-white px-4 py-2 rounded-lg"
      >
        <FaSignOutAlt />

        {!compact && <span>خروج از حساب کاربری</span>}
      </SubmitButton>
    </>
  );
}
