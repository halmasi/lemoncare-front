'use client';
import SubmitButton from '@/app/components/formElements/SubmitButton';
import Cart from '@/app/components/navbarComponents/Cart';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/app/utils/states/useCartData';
import Toman from '@/app/components/Toman';

export default function CartPage() {
  const [count, setCount] = useState(0);
  const [price, setPrice] = useState({ before: 0, main: 0 });

  const { cart } = useCartStore();

  useEffect(() => {
    if (cart && cart.length) {
      setCount(cart.length);
    } else setCount(0);
  }, [cart]);

  return (
    <div className="flex flex-col md:flex-row w-full px-4 pt-2 gap-4 md:max-w-screen-lg">
      <div className="w-full">
        {count > 0 && (
          <div className="flex gap-1">
            <p className="text-accent-pink">{count}</p>{' '}
            <p> محصول در سبد خرید.</p>
          </div>
        )}
        <Cart
          key={count}
          priceAmount={(main, before) => {
            setPrice({
              before,
              main,
            });
          }}
        />
      </div>
      {price.main != 0 && (
        <>
          <div className="flex flex-wrap h-fit w-full border rounded-lg p-5 md:w-5/12 md:sticky md:top-5 items-center gap-3 justify-between">
            <div className="flex w-full justify-between items-center gap-3">
              <p className="text-sm">مجموع خرید({count}):</p>
              <p className="line-through text-gray-500 text-sm">
                {(price.before / 10).toLocaleString('fa-IR')}
              </p>
              <Toman className="fill-accent-green text-accent-green">
                <p className="font-bold text-lg">
                  {(price.main / 10).toLocaleString('fa-IR')}
                </p>
              </Toman>
            </div>
            <Toman>
              {' '}
              <p className="font-bold text-sm">
                سود شما:{' '}
                {((price.before - price.main) / 10).toLocaleString('fa-IR')}{' '}
              </p>
            </Toman>
            <p className="text-xs text-gray-500">
              {((1 - price.main / price.before) * 100).toLocaleString('fa-IR', {
                style: 'decimal',
                maximumFractionDigits: 0,
              })}{' '}
              درصد تخفیف
            </p>
            <div className="w-full md:w-fit mb-3">
              <SubmitButton link="cart/checkout">ثبت سفارش</SubmitButton>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
