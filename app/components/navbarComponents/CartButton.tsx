'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { RiShoppingCart2Fill } from 'react-icons/ri';
import Cart from './Cart';

export default function CartButton() {
  const [showItems, setShowItems] = useState(false);
  const [itemCount, setItemCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="flex flex-col justify-end"
        onMouseOver={() => {
          setShowItems(true);
        }}
        onMouseOut={() => {
          setShowItems(false);
        }}
      >
        <div className="flex flex-col rounded-lg border p-2 h-fit justify-start">
          {itemCount > 0 && (
            <div className="flex items-center justify-start">
              <div className="absolute z-0 w-6 h-6 bg-accent-pink rounded-full p-[0.2rem] -mt-4 -mr-4" />
              <div className="absolute text-white -mt-3 -mr-3">
                <p className="z-10 text-xs font-bold px-1">{itemCount}</p>
              </div>
            </div>
          )}
          <RiShoppingCart2Fill className="text-2xl" />
        </div>
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
              className="absolute left-20 top-44 w-[50%] min-[1024px]:w-[35%] bg-white rounded-lg border"
            >
              <div className="p-5 w-full h-[50svh] overflow-y-scroll">
                <Cart countFunc={(count: number) => setItemCount(count)} />
              </div>
            </motion.div>
          }
        </AnimatePresence>
      </div>
    </div>
  );
}
