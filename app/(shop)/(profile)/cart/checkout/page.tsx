'use client';

import DeliveryMethods from '@/app/components/checkout/DeliveryMethods';
import SubmitButton from '@/app/components/formElements/SubmitButton';
import Addresses from '@/app/components/profile/Addresses';
import AuthForm from '@/app/components/profile/AuthForm';
import Toman from '@/app/components/Toman';
import { useCartStore } from '@/app/utils/states/useCartData';
import { useCheckoutStore } from '@/app/utils/states/useCheckoutData';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { useEffect, useState } from 'react';

export default function page() {
  const { cart, cartProducts } = useCartStore();
  const { setPrice, price, setBeforePrice, shippingPrice } = useCheckoutStore();
  const { user } = useDataStore();
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalBeforePrice, setTotalBeforePrice] = useState<number>(0);
  const [showNext, setShowNext] = useState<boolean>(false);

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
  useEffect(() => {
    setPrice(totalPrice);
    setBeforePrice(totalBeforePrice);
  }, [totalPrice]);
  if (!totalPrice) return <div>loading</div>;
  return (
    <>
      <div className="w-full flex flex-col gap-2 md:flex-row justify-between">
        <div className="w-full md:w-4/12 p-2 md:p-5 rounded-lg bg-gray-50/50 border">
          <h6>انتخاب آدرس:</h6>
          <Addresses />
        </div>
        <div className="w-full md:w-5/12 p-2 md:p-5 rounded-lg bg-gray-50/50 border min-h-svh">
          <h6>روش ارسال:</h6>
          <DeliveryMethods
            onChangeFn={(isSelected: boolean) => {
              setShowNext(isSelected);
            }}
          />
        </div>
        <div className="flex flex-col h-fit w-full md:w-3/12 md:sticky md:top-5">
          {!user && (
            <div className="flex flex-col h-fit w-full border rounded-lg p-5 items-center gap-3 justify-between">
              <AuthForm />
            </div>
          )}
          <div className="flex flex-col h-fit w-full border rounded-lg p-5 items-center gap-3 justify-between">
            <div className="flex flex-wrap gap-2 text-sm">
              <p>مجموع خرید:</p>
              <div className="flex flex-wrap md:pr-5 items-center justify-center gap-2">
                <p className="line-through text-xl text-gray-500">
                  {totalBeforePrice / 10}
                </p>
                <Toman className="fill-accent-green text-accent-green">
                  <p>
                    <strong>{(price / 10).toLocaleString('fa-IR')}</strong>
                  </p>
                </Toman>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-sm">
              <p>هزینه ارسال:</p>
              {shippingPrice != 0 ? (
                <Toman className="fill-accent-green text-accent-green">
                  <p>{(shippingPrice / 10).toLocaleString('fa-IR')}</p>
                </Toman>
              ) : (
                <p className="text-gray-500">آدرس یا نحوه ارسال تعیین نشده</p>
              )}
            </div>
            <div className="flex flex-wrap border-t gap-2 text-sm">
              <p>جمع کل:</p>

              <Toman className="fill-accent-green text-accent-green">
                <p>
                  {(shippingPrice / 10 + price / 10).toLocaleString('fa-IR')}
                </p>
              </Toman>
            </div>
            <SubmitButton
              link="/cart/checkout/payment"
              disabled={!showNext || !user}
            >
              ثبت سفارش
            </SubmitButton>
          </div>
        </div>
      </div>
    </>
  );
}
