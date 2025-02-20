'use client';

import { useDataStore } from '@/app/utils/states/useUserdata';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FiUser } from 'react-icons/fi';

export default function Gravatar({ className }: { className?: string }) {
  const [icon, setIcon] = useState(<FiUser className="text-3xl" />);
  const getGravatarFn = useMutation({
    mutationFn: async (email: string) => {
      const get = await fetch('/api/auth/gravatar', {
        method: 'POST',
        body: JSON.stringify({ email: email }),
      });
      const result = await get.json();
      if (get.status == 200) return JSON.parse(result);
    },
    onSuccess: (data) => {
      setIcon(
        <Image
          src={data.url}
          alt="gravatar"
          width={100}
          height={100}
          className={`object-cover w-10 h-10  aspect-square ${className}`}
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
    <div
      className={`flex rounded-full overflow-hidden w-10 h-10 items-center justify-center bg-slate-300 ${className}`}
    >
      {icon}
    </div>
  );
}
