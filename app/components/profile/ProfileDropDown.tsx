import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import ProfileMenu from './ProfileMenu';
import { useDataStore } from '@/app/utils/states/useUserdata';
import Link from 'next/link';
import { RiAccountPinCircleFill } from 'react-icons/ri';
import { IoIosArrowBack, IoIosArrowDown } from 'react-icons/io';
import Gravatar from './Gravatar';

export default function ProfileDropDown({ usersName }: { usersName: string }) {
  const path = usePathname();
  const [showItems, setShowItems] = useState(false);

  const { jwt } = useDataStore();

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="flex flex-col relative w-full"
        onMouseOver={() => {
          setShowItems(true);
        }}
        onMouseOut={() => {
          setShowItems(false);
        }}
      >
        <Link
          href={'/login'}
          className="flex w-fit flex-wrap items-center gap-1 p-2 border rounded-xl"
        >
          <RiAccountPinCircleFill className="text-2xl" />
          <IoIosArrowDown />
        </Link>
        {!path.startsWith('/dashboard') && !path.startsWith('/cart') && jwt && (
          <AnimatePresence>
            {
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  showItems
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 20, visibility: 'hidden' }
                }
                exit={{ opacity: 0, y: 20, visibility: 'hidden' }}
                style={showItems ? {} : {}}
                transition={{
                  duration: 0.3,
                  ease: 'easeOut',
                }}
                className="absolute p-5 left-0 top-full min-w-[30rem] w-[50%] max-w-[50rem] min-[1024px]:w-[35%] bg-white rounded-lg border shadow-lg"
              >
                <ProfileMenu
                  extraItems={[
                    {
                      items: [
                        {
                          name: (
                            <div className="flex items-center justify-between w-full">
                              <div className="flex gap-3">
                                <Gravatar />
                                <p>{usersName}</p>
                              </div>
                              <IoIosArrowBack />
                            </div>
                          ),
                          key: usersName,
                          url: '/dashboard',
                        },
                      ],
                      position: 'top',
                    },
                  ]}
                />
              </motion.div>
            }
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
