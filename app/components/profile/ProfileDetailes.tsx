'use client';

import { useDataStore } from '@/app/utils/states/useUserdata';
import { motion } from 'framer-motion';
import Gravatar from './Gravatar';

export default function ProfileDetailes() {
  const { user } = useDataStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b w-full p-6 ml-4"
    >
      <div className="flex items-center gap-3 ">
        <Gravatar className="w-20 h-20" />
        <div>
          <h3 className="text-lg font-bold">{user?.fullName}</h3>
          <p className="text-sm text-gray-500">{user?.username}</p>
          <p className="text-sm text-gray-500">{user?.email ?? ''}</p>
        </div>
      </div>
    </motion.div>
  );
}
