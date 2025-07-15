'use client';

import { useDataStore } from '@/app/utils/states/useUserdata';
import ProfileDetailes from '@/app/components/profile/ProfileDetailes';
import { ReactNode, useState } from 'react';
import ProfileMenu from '@/app/components/profile/ProfileMenu';
import { motion } from 'framer-motion';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { jwt } = useDataStore();
  const [compact, setCompact] = useState(false);
  return (
    <div className="flex w-full justify-start bg-gray-100 p-4 gap-4">
      {/* Sidebar */}
      {jwt && (
        <motion.aside
          className="hidden md:flex flex-col bg-white p-4 rounded-xl shadow-sm"
          initial={{ width: compact ? 80 : 400 }}
          animate={{ width: compact ? 80 : 400 }}
          transition={{ duration: 0.2 }}
        >
          <button
            className={`${compact ? 'self-center' : 'self-end'} p-3 m-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200 transition-colors`}
            onClick={() => setCompact(!compact)}
          >
            {compact ? <IoIosArrowBack className="" /> : <IoIosArrowForward />}
          </button>
          <ProfileDetailes compact={compact} />
          <ProfileMenu compact={compact} />
        </motion.aside>
      )}
      {/* Main Content */}
      <main className="flex w-full bg-white p-6 rounded-xl shadow-md justify-center">
        {children}
      </main>
    </div>
  );
}
