'use client';

import { useDataStore } from '@/app/utils/states/useUserdata';
import React, { useEffect, useState } from 'react';

export default function Dashboard() {
  const { user } = useDataStore();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    console.log('User Data:', user);
    if (user) {
      setUserData(user); // Directly set user instead of user.data
    }
  }, [user]);

  if (!userData) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">اطلاعات کاربری</h2>
      <ul className="bg-gray-100 p-4 rounded-lg shadow">
        {Object.entries(userData).map(([key, value]) => (
          <li key={key} className="p-2 border-b last:border-none">
            <strong>{key}:</strong>
            {typeof value === 'string' ? value : JSON.stringify(value)}
          </li>
        ))}
      </ul>
    </div>
  );
}
