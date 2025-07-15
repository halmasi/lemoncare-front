'use client';

import LoadingAnimation from '@/app/components/LoadingAnimation';
import { getFullUserData } from '@/app/utils/actions/actionMethods';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const { user, setUser, jwt } = useDataStore();

  const getUserDataFn = useMutation({
    mutationFn: async () => {
      const res = await getFullUserData();
      return res.body;
    },
    onSuccess: async (data) => {
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
    <div className="hidden md:flex w-full">
      {/* show on desktop */}
      <div className="hidden md:flex"></div>

      {/* show on mobile */}
      <div className="md:hidden" />
    </div>
  );
}
