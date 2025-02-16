'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { RiShoppingCart2Fill } from 'react-icons/ri';
import Cart from './Cart';
import { usePathname } from 'next/navigation';
import SubmitButton from '../formElements/SubmitButton';
import Link from 'next/link';
import { useCartStore } from '@/app/utils/states/useCartData';

export default function CartButton() {
  const path = usePathname();

  const [showItems, setShowItems] = useState(false);
  const [price, setPrice] = useState({ before: 0, main: 0 });

  const { cart } = useCartStore();

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="flex flex-col relative w-full"
        onMouseOver={() => {
          if (!path.startsWith('/cart')) setShowItems(true);
        }}
        onMouseOut={() => {
          setShowItems(false);
        }}
      >
        <Link
          href={!showItems ? '#' : '/cart'}
          className="flex flex-col rounded-lg border p-2 h-fit justify-start"
        >
          {cart && cart.length > 0 && (
            <div className="flex items-center justify-start">
              <div className="absolute z-0 w-6 h-6 bg-accent-pink rounded-full p-[0.2rem] -mt-4 -mr-4" />
              <div className="absolute text-white -mt-3 -mr-3">
                <p className="z-10 text-xs font-bold px-1">{cart.length}</p>
              </div>
            </div>
          )}
          <RiShoppingCart2Fill className="text-2xl" />
        </Link>
        {!path.startsWith('/cart') && (
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
                className="absolute left-0 top-full min-w-[30rem] w-[50%] max-w-[50rem] min-[1024px]:w-[35%] bg-white rounded-lg border shadow-lg"
              >
                <div className="w-full min-h-[16rem] max-h-[50svh] overflow-y-scroll">
                  <div className="p-5 ">
                    <Cart
                      key={cart.length}
                      priceAmount={(main, before) => {
                        setPrice({
                          before,
                          main,
                        });
                      }}
                    />
                  </div>
                  {price.main >= 1 && (
                    <div className="-bottom-1 z-20 sticky h-20 justify-center">
                      <div className="w-full h-full bg-background flex items-center justify-between p-5">
                        <div className="w-full md:w-fit mb-3">
                          <SubmitButton link="/cart">ثبت سفارش</SubmitButton>
                        </div>
                        <div className="flex gap-2 items-center">
                          <h6>مبلغ کل:</h6>
                          {price.before != 0 && (
                            <p className="line-through text-gray-500/50">
                              {(price.before / 10).toLocaleString('fa-IR')}
                            </p>
                          )}
                          <p className="text-accent-green text-lg">
                            {(price.main / 10).toLocaleString('fa-IR')} تومان
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            }
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
