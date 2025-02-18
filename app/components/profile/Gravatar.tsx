'use client';

import { useDataStore } from '@/app/utils/states/useUserdata';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FiUser } from 'react-icons/fi';

export default function Gravatar() {
  const [icon, setIcon] = useState(<FiUser className="text-3xl" />);
  const getGravatarFn = useMutation({
    mutationFn: async (email: string) => {
      const get = await fetch('/api/auth/gravatar', {
        method: 'POST',
        body: JSON.stringify({ email: email }),
      });
      const result = await get.json();
      if (get.status == 200) return result;
    },
    onSuccess: (data) => {
      setIcon(
        <Image
          src={data.url}
          alt="gravatar"
          width={5}
          height={5}
          className="w-10 h-10 object-cover aspect-square"
        />
      );
    },
    onError: () => {
      setIcon(<FiUser className="text-3xl" />);
    },
  });
  const { user } = useDataStore();
  useEffect(() => {
    if (user && user.email) {
      //   getGravatarFn.mutate(user.email);
      getGravatarFn.mutate('h.almasi2012@gmail.com');
    }
  }, [user]);
  return (
    <div className="flex rounded-full w-10 h-10 items-center justify-center bg-slate-300">
      {icon}
    </div>
  );
}
