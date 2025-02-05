'use client';
import SubmitButton from '@/app/components/formElements/SubmitButton';
import Cart from '@/app/components/navbarComponents/Cart';
import { useState } from 'react';

export default function CartPage() {
  const [itemCount, setItemCount] = useState(0);
  const [price, setPrice] = useState({ before: 0, main: 0 });
  return (
    <div className="flex flex-col w-full px-4 pt-2 gap-4 md:max-w-screen-lg">
      <div className="flex gap-1">
        <p className="text-accent-pink">{itemCount}</p>{' '}
        <p> محصول در سبد خرید.</p>
      </div>
      <Cart
        priceAmount={(main, before) => {
          setPrice({
            before,
            main,
          });
        }}
        countFunc={(count: number) => setItemCount(count)}
      />
      {price.main != 0 && (
        <>
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <div className="flex items-center gap-3">
              <h6>مجموع خرید:</h6>
              <p className="line-through text-gray-500 text-sm">
                {(price.before / 10).toLocaleString('fa-IR')}
              </p>
              <p>{(price.main / 10).toLocaleString('fa-IR')} تومان</p>
            </div>
            <p>
              سود شما:{' '}
              {((price.before - price.main) / 10).toLocaleString('fa-IR')} تومان
            </p>
            <p className="text-sm text-gray-500">
              {((1 - price.main / price.before) * 100).toLocaleString('fa-IR', {
                style: 'decimal',
                maximumFractionDigits: 0,
              })}{' '}
              درصد تخفیف
            </p>
          </div>
          <div className="w-full md:w-fit mb-3">
            <SubmitButton>تکمیل سفارش</SubmitButton>
          </div>
        </>
      )}
    </div>
  );
}
