'use client';
import SubmitButton from '@/app/components/formElements/SubmitButton';
import Cart from '@/app/components/navbarComponents/Cart';
import { useState } from 'react';
import Toman from '@/app/components/Toman';
import Title from '@/app/components/Title';
import { useRouter } from 'next/navigation';
import { useCheckoutStore } from '@/app/utils/states/useCheckoutData';

export default function CartPage() {
  const [count, setCount] = useState(0);
  const [prices, setPrices] = useState({ before: 0, main: 0 });
  const { setBeforePrice, setPrice } = useCheckoutStore();
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
              setPrices({
                before,
                main,
              });
              setPrice(main);
              setBeforePrice(before);
              setCount(itemcount);
              router.refresh();
            }}
          />
        </div>
        {prices.main != 0 && (
          <div className="flex flex-wrap h-fit w-full border rounded-lg p-5 md:w-3/12 md:sticky md:top-5 items-center gap-3 justify-between">
            <div className="flex w-full justify-between items-center gap-3">
              <p className="text-sm">مجموع خرید({count}):</p>
              {prices.before > 0 && prices.before > prices.main && (
                <p className="line-through text-gray-500 text-sm">
                  {(prices.before / 10).toLocaleString('fa-IR')}
                </p>
              )}
              <Toman className="fill-accent-green text-accent-green">
                <p className="font-bold text-lg">
                  {(prices.main / 10).toLocaleString('fa-IR')}
                </p>
              </Toman>
            </div>
            {prices.before - prices.main > 0 && (
              <>
                <Toman>
                  <p className="font-bold text-sm">
                    سود شما:{' '}
                    {((prices.before - prices.main) / 10).toLocaleString(
                      'fa-IR'
                    )}{' '}
                  </p>
                </Toman>
                <p className="text-xs text-gray-500">
                  {((1 - prices.main / prices.before) * 100).toLocaleString(
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
