'use client';

import { getGravatar } from '@/app/utils/data/getUserInfo';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { ReactNode, useEffect, useState } from 'react';
import { FiUser } from 'react-icons/fi';

export default function Gravatar({
  className,
  emailAddress,
  size,
}: {
  className?: string;
  emailAddress?: string;
  size?: number;
}) {
  const [icon, setIcon] = useState<ReactNode>(<FiUser className="text-3xl" />);
  const getGravatarFn = useMutation({
    mutationFn: async (email: string) => {
      const get = await getGravatar(email);
      return get;
    },
    onSuccess: (data) => {
      if (!data) return;
      setIcon(
        <Image
          src={`${data}${size ? '?size=' + size : ''}`}
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
    if (emailAddress) {
      getGravatarFn.mutateAsync(emailAddress);
    } else if (user && user.email) {
      getGravatarFn.mutateAsync(user.email);
    }
  }, [user, emailAddress]);

  return (
    <div
      className={`flex rounded-full overflow-hidden w-10 h-10 items-center justify-center bg-slate-300 ${className}`}
    >
      {icon}
    </div>
  );
}
