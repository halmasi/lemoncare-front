'use client';

import LoadingAnimation from '@/app/components/LoadingAnimation';
import { getFullUserData } from '@/app/utils/actions/actionMethods';
import { OrderHistoryProps } from '@/app/utils/schema/userProps';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const [orderHistory, setOrderHistory] = useState<OrderHistoryProps[]>([]);

  const { user, setUser, jwt } = useDataStore();

  const getUserDataFn = useMutation({
    mutationFn: async () => {
      const res = await getFullUserData();
      return res.body;
    },
    onSuccess: async (data) => {
      setOrderHistory(data.orderHistory || []);
      setUser(data);
    },
    onError: (error: { message: string[] }) => {
      toast.error('Error:' + error.message);
    },
  });

  useEffect(() => {
    if (!user) {
      getUserDataFn.mutateAsync();
    }
  }, [user, jwt]);

  if (!jwt || !user) {
    return (
      <div>
        <h4>در حال بارگزاری ...</h4>
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <div className="p-6 w-full">
      <h2>آخرین سفارش</h2>
      <ul className="bg-gray-100 p-4 rounded-lg shadow">
        {Object.entries(user).map(([key, value]) => (
          <li key={key} className="p-2 border-b last:border-none">
            <strong>{key}:</strong>
            {typeof value === 'string' ? value : JSON.stringify(value)}
          </li>
        ))}
      </ul>
    </div>
  );
}
