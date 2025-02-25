'use client';

import Addresses from '@/app/components/profile/Addresses';
import Toman from '@/app/components/Toman';
import { useCartStore } from '@/app/utils/states/useCartData';
import { useEffect, useState } from 'react';

export default function page() {
  const { cart, cartProducts } = useCartStore();

  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalBeforePrice, setTotalBeforePrice] = useState<number>(0);

  useEffect(() => {
    setTotalBeforePrice(0);
    setTotalPrice(0);
    cart.forEach((cartItem) => {
      let priceBefore = 0;
      let priceAfter = 0;

      const product = cartProducts.find(
        (searchProduct) =>
          searchProduct.documentId == cartItem.product.documentId
      );

      if (product) {
        product.variety.forEach((varieties) => {
          if (cartItem.variety.id == varieties.uniqueId)
            if (!cartItem.variety.sub) {
              priceAfter = varieties.mainPrice;
              priceBefore = varieties.priceBeforeDiscount;
            } else {
              varieties.subVariety.forEach((sub) => {
                if (sub.uniqueId == cartItem.variety.sub) {
                  priceAfter = sub.mainPrice;
                  priceBefore = sub.priceBefforDiscount;
                }
              });
            }
        });
        setTotalPrice((prev) => prev + priceAfter * cartItem.count);
        setTotalBeforePrice((prev) => prev + priceBefore * cartItem.count);
      }
    });
  }, [cart]);
  if (!totalPrice) return <div>loading</div>;
  return (
    <>
      <div className="w-full justify-start">
        <div className="w-full md:w-5/12 p-2 md:p-5 rounded-lg bg-gray-50/50 border min-h-svh">
          <div className="text-center flex flex-wrap gap-2 border-b items-center justify-center">
            <h6>مجموع خرید:</h6>
            <div className="flex md:pr-5 items-center justify-center gap-2">
              <p className="line-through text-xl text-gray-500">
                {totalBeforePrice / 10}
              </p>
              <Toman className="fill-accent-green text-accent-green">
                <p>
                  <strong className="text-3xl">
                    {(totalPrice / 10).toLocaleString('fa-IR')}
                  </strong>
                </p>
              </Toman>
            </div>
          </div>
          <h6>انتخاب آدرس:</h6>
          <Addresses />
        </div>
      </div>
    </>
  );
}
