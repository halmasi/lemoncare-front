'use client';

import { useDataStore } from '@/app/utils/states/useUserdata';
import ProfileDetailes from '@/app/components/profile/ProfileDetailes';
import { ReactNode, useState } from 'react';
import ProfileMenu from '@/app/components/profile/ProfileMenu';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { usePathname } from 'next/navigation';
import { RiDashboard2Fill } from 'react-icons/ri';
import { ImProfile } from 'react-icons/im';
import { MdAdminPanelSettings } from 'react-icons/md';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { jwt } = useDataStore();
  const [compact, setCompact] = useState(false);
  const path = usePathname();

  return (
    <div className="flex flex-col lg:flex-row w-full justify-start bg-gray-100 p-4 gap-4">
      {/* Sidebar */}
      {jwt && (
        <aside
          className={`flex flex-col bg-white p-4 rounded-xl shadow-sm ${compact ? 'w-20' : 'w-full'} lg:w-5/12 lg:max-w-80 ${path != '/dashboard' && 'hidden lg:flex'} transition-width duration-300`}
        >
          <button
            className={`hidden md:flex ${compact ? 'self-center' : 'self-end'} p-3 m-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200 transition-colors`}
            onClick={() => setCompact(!compact)}
          >
            {compact ? <IoIosArrowBack className="" /> : <IoIosArrowForward />}
          </button>
          <ProfileDetailes compact={compact} />
          <ProfileMenu
            compact={compact}
            extraItems={[
              {
                items: [
                  {
                    key: 'profile',
                    name: <p>داشبورد</p>,
                    title: 'داشبورد',
                    icon: <MdAdminPanelSettings />,
                    url: '/dashboard',
                  },
                ],
                position: 'top',
              },
            ]}
          />
        </aside>
      )}
      {/* Main Content */}
      <main
        className={`flex w-full bg-white p-6 rounded-xl shadow-md justify-center `}
      >
        {children}
      </main>
    </div>
  );
}
