'use client';
import SubmitButton from '@/app/components/formElements/SubmitButton';
import Cart from '@/app/components/navbarComponents/Cart';
import { useState } from 'react';
import Toman from '@/app/components/Toman';
import Title from '@/app/components/Title';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const [count, setCount] = useState(0);
  const [price, setPrice] = useState({ before: 0, main: 0 });
  const router = useRouter();

  return (
    <div className="w-full">
      <Title>
        <h6 className="text-accent-pink">سبد خرید</h6>
      </Title>
      <div className="flex flex-col md:flex-row justify-around w-full px-4 pt-2 gap-4">
        <div className="w-full max-w-screen-md">
          {count > 0 && (
            <div className="flex gap-1">
              <p className="text-accent-pink">{count}</p>{' '}
              <p> محصول در سبد خرید.</p>
            </div>
          )}
          <Cart
            priceAmount={(main, before, itemcount) => {
              setPrice({
                before,
                main,
              });
              setCount(itemcount);
              router.refresh();
            }}
          />
        </div>
        {price.main != 0 && (
          <div className="flex flex-wrap h-fit w-full border rounded-lg p-5 md:w-3/12 md:sticky md:top-5 items-center gap-3 justify-between">
            <div className="flex w-full justify-between items-center gap-3">
              <p className="text-sm">مجموع خرید({count}):</p>
              {price.before > 0 && price.before > price.main && (
                <p className="line-through text-gray-500 text-sm">
                  {(price.before / 10).toLocaleString('fa-IR')}
                </p>
              )}
              <Toman className="fill-accent-green text-accent-green">
                <p className="font-bold text-lg">
                  {(price.main / 10).toLocaleString('fa-IR')}
                </p>
              </Toman>
            </div>
            {price.before - price.main > 0 && (
              <>
                <Toman>
                  <p className="font-bold text-sm">
                    سود شما:{' '}
                    {((price.before - price.main) / 10).toLocaleString('fa-IR')}{' '}
                  </p>
                </Toman>
                <p className="text-xs text-gray-500">
                  {((1 - price.main / price.before) * 100).toLocaleString(
                    'fa-IR',
                    {
                      style: 'decimal',
                      maximumFractionDigits: 0,
                    }
                  )}
                  درصد تخفیف
                </p>
              </>
            )}
            <div className="w-full md:w-fit mb-3">
              <SubmitButton link="cart/checkout">ثبت سفارش</SubmitButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
