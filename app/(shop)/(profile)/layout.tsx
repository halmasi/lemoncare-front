'use client';

import { useDataStore } from '@/app/utils/states/useUserdata';
import ProfileDetailes from '@/app/components/profile/ProfileDetailes';
import { ReactNode } from 'react';
import ProfileMenu from '@/app/components/profile/ProfileMenu';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { jwt } = useDataStore();

  return (
    <div className="flex w-full justify-start bg-gray-100 p-4 gap-4">
      {/* Sidebar */}
      {jwt && (
        <aside className=" hidden md:flex flex-col bg-white p-4 rounded-xl shadow-sm">
          <ProfileDetailes />
          <ProfileMenu />
        </aside>
      )}
      {/* Main Content */}
      <main className="flex w-full bg-white p-6 rounded-xl shadow-md justify-center">
        {children}
      </main>
    </div>
  );
}
