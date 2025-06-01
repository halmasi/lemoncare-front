'use client';

import LoadingAnimation from '@/app/components/LoadingAnimation';
import { getFullUserData } from '@/app/utils/actions/actionMethods';
import { OrderHistoryProps } from '@/app/utils/schema/userProps';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [orderHistory, setOrderHistory] = useState<OrderHistoryProps[]>([]);

  const { user, setUser } = useDataStore();

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
      console.error('Error:', error.message);
    },
  });

  useEffect(() => {
    if (!user) {
      getUserDataFn.mutateAsync();
    }
  }, [user]);

  if (!user) {
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
      {getUserDataFn.isPending ? (
        <div className="w-full h-52 bg-gray-500 animate-pulse p-2">
          <div className="p-2 h-full w-40 bg-gray-300 rounded-lg"></div>
        </div>
      ) : (
        orderHistory.length > 0 && (
          <div>
            {orderHistory.map((item, index) => (
              <div key={index}>
                {item.order.items.map((product, index) => (
                  <div key={index}>
                    <p>{product.product.documentId}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )
      )}
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
