'use client';

import { useDataStore } from '@/app/utils/states/useUserdata';
import { useCartStore } from '@/app/utils/states/useCartData';
import { logoutAction } from '@/app/utils/actions/actionMethods';
import {
  FaShoppingCart,
  FaRegHeart,
  FaMapMarkerAlt,
  FaUser,
  FaSignOutAlt,
  FaReceipt,
} from 'react-icons/fa';
import ProfileMenu from '@/app/components/profile/ProfileMenu';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { resetUser, jwt, setUser } = useDataStore();
  const { resetCart, setCart } = useCartStore();

  const menuItems = [
    { name: 'سبد خرید', icon: <FaShoppingCart />, key: 'cart', url: '/cart' },
    { name: 'سفارش‌ها', icon: <FaReceipt />, key: 'orders' },
    { name: 'مالی', icon: <FaUser />, key: 'finance' },
    { name: 'آدرس‌ها', icon: <FaMapMarkerAlt />, key: 'addresses' },
    { name: 'علاقه‌مندی‌ها', icon: <FaRegHeart />, key: 'favorites' },
    {
      name: 'اطلاعات حساب کاربری',
      icon: <FaUser />,
      key: 'profile',
      url: '/dashboard/information',
    },
  ];

  const logoutFn = useMutation({
    mutationFn: async () => {
      await logoutAction();
      resetUser();
      resetCart();
    },
  });

  return (
    <div className="flex w-full justify-start bg-gray-100 p-4 gap-4">
      {/* Sidebar */}
      {jwt && (
        <aside className=" hidden md:flex flex-col bg-white p-4 rounded-xl shadow-sm">
          <>
            <ProfileMenu />
            <nav className="mt-6">
              {menuItems.map((item) => (
                <motion.div
                  key={item.key}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-200 rounded-lg"
                >
                  {item.icon}
                  <Link href={item.url || '/dashboard'}>
                    <span>{item.name}</span>
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
        </aside>
      )}
      {/* Main Content */}
      <main className="flex w-full bg-white p-6 rounded-xl shadow-md justify-center">
        {children}
      </main>
    </div>
  );
}
