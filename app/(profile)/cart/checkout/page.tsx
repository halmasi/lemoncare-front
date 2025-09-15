'use client';

import Addresses from '@/app/components/profile/Addresses';
import AuthForm from '@/app/components/profile/auth/AuthForm';
import Title from '@/app/components/Title';
import { varietyFinder } from '@/app/utils/shopUtils';
import { useCartStore } from '@/app/utils/states/useCartData';
import { useCheckoutStore } from '@/app/utils/states/useCheckoutData';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { useEffect, useState } from 'react';
import { getProduct } from '@/app/utils/data/getProducts';
import LoadingAnimation from '@/app/components/LoadingAnimation';
import SubmitButton from '@/app/components/formElements/SubmitButton';

export default function CheckoutPage() {
  const { cart } = useCartStore();
  const {
    setPrice,
    price,
    setBeforePrice,
    setCheckoutAddress,
    checkoutAddress,
  } = useCheckoutStore();
  const { user } = useDataStore();
  const [loading, setLoading] = useState<boolean>(true);
  // const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setCheckoutAddress(null);
      setLoading(false);
      // const check = await loginCheck();
      // if (check.isAuthenticated) {
      //   setIsLoggedIn(true);
      // }
      // setLoading(false);
    })();
  }, [user]);

  useEffect(() => {
    if (!price && cart && Array.isArray(cart) && cart.length > 0) {
      let before = 0;
      let main = 0;
      cart.forEach(async (cartItem) => {
        let priceBefore = 0;
        let priceAfter = 0;
        const product = await getProduct({ slug: cartItem.product.documentId });

        const variety = varietyFinder(cartItem.variety, product.res[0]);
        priceBefore = variety.priceBefforDiscount;
        priceAfter = variety.mainPrice;
        before += priceBefore * cartItem.count;
        main = priceAfter * cartItem.count;
      });
      setPrice(main);
      setBeforePrice(before);
    }
  }, [cart]);

  // useEffect(() => {
  //   if (totalPrice) setPrice(totalPrice);
  //   if (totalBeforePrice) setBeforePrice(totalBeforePrice);
  // }, [totalPrice]);

  if (!price || loading)
    return (
      <div className="flex flex-col items-center justify-center">
        <h6>درحال بارگذاری</h6>
        <LoadingAnimation />
      </div>
    );

  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-2  justify-center">
        {user ? (
          <div className="flex flex-col w-full max-w-4xl gap-5  p-2 lg:p-5 rounded-lg bg-gray-50/50 border">
            <Title>
              <h6 className="text-accent-pink">انتخاب آدرس:</h6>
            </Title>
            <Addresses />
            <div className="flex items-center justify-center">
              <SubmitButton
                disabled={!checkoutAddress}
                className="bg-pink-700 text-white hover:bg-pink-500 hover:text-white"
                link="/cart/checkout/delivery"
              >
                ادامه فرایند خرید و انتخاب روش ارسال
              </SubmitButton>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-fit max-w-4xl w-full border rounded-lg p-5 items-center gap-3 justify-between">
            <AuthForm />
          </div>
        )}
      </div>
    </>
  );
}
