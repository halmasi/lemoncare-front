'use client';

import SubmitButton from '@/app/components/formElements/SubmitButton';
import DeliveryMethods from '@/app/components/checkout/DeliveryMethods';
import Addresses from '@/app/components/profile/Addresses';
import AuthForm from '@/app/components/profile/auth/AuthForm';
import Title from '@/app/components/Title';
import Toman from '@/app/components/Toman';
import { varietyFinder } from '@/app/utils/shopUtils';
import { useCartStore } from '@/app/utils/states/useCartData';
import { useCheckoutStore } from '@/app/utils/states/useCheckoutData';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { useEffect, useState } from 'react';
import Coupon from '@/app/components/Coupon';

export default function CheckoutPage() {
  const { cart, cartProducts } = useCartStore();
  const {
    setPrice,
    price,
    setBeforePrice,
    shippingPrice,
    shippingOption,
    checkoutAddress,
  } = useCheckoutStore();
  const { user } = useDataStore();
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalBeforePrice, setTotalBeforePrice] = useState<number>(0);
  const [showNext, setShowNext] = useState<boolean>(false);

  useEffect(() => {
    if (cart && Array.isArray(cart) && cart.length > 0) {
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
          const variety = varietyFinder(cartItem.variety, product);
          priceBefore = variety.priceBefforDiscount;
          priceAfter = variety.mainPrice;

          setTotalPrice((prev) => prev + priceAfter * cartItem.count);
          setTotalBeforePrice((prev) => prev + priceBefore * cartItem.count);
        }
      });
    }
  }, [cart]);

  useEffect(() => {
    if (totalPrice) setPrice(totalPrice);
    if (totalBeforePrice) setBeforePrice(totalBeforePrice);
  }, [totalPrice]);

  if (!totalPrice) return <div>درحال بارگذاری</div>;

  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-2  justify-between">
        {user ? (
          <div className="flex flex-col w-full lg:w-4/12 gap-5  p-2 lg:p-5 rounded-lg bg-gray-50/50 border">
            <Title>
              <h6 className="text-accent-pink">انتخاب آدرس:</h6>
            </Title>
            <Addresses />
          </div>
        ) : (
          <div className="flex flex-col h-fit lg:w-4/12 w-full border rounded-lg p-5 items-center gap-3 justify-between">
            <AuthForm />
          </div>
        )}
        <div className="flex flex-col gap-5 w-full lg:w-5/12 p-2 lg:p-5 rounded-lg bg-gray-50/50 border min-h-svh">
          <Title>
            <h6 className="text-accent-pink">روش ارسال:</h6>
          </Title>
          <DeliveryMethods
            onChangeFn={(isSelected: boolean) => {
              setShowNext(isSelected);
            }}
          />
        </div>
        <div className="flex flex-col gap-2 h-fit w-full lg:w-3/12 lg:sticky lg:top-5">
          <div>
            <Coupon />
          </div>
          <div className="flex flex-col h-fit w-full border rounded-lg p-5 items-center gap-3 justify-between">
            {checkoutAddress && (
              <div>
                <p className="text-gray-600">آدرس انتخاب شده: </p>
                <p className="text-accent-pink">
                  <span>{checkoutAddress.province}</span>
                  {'، '}
                  <span>{checkoutAddress.city}</span>
                  {'، '}
                  <span>{checkoutAddress.address}</span>{' '}
                </p>
                <p className="text-accent-pink">
                  <span className="text-gray-600">شماره تلفن همراه:</span>{' '}
                  {checkoutAddress.mobileNumber}
                </p>{' '}
              </div>
            )}
            <div className="flex flex-wrap gap-2 text-sm">
              <p>مجموع خرید:</p>
              <div className="flex flex-wrap md:pr-5 items-center justify-center gap-2">
                <p className="line-through text-xl text-gray-500">
                  {totalBeforePrice > 0 && totalBeforePrice / 10}
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
              {shippingPrice > -1 ? (
                shippingOption.courier_code == 'TIPAX' ? (
                  <p className="text-accent-green">پس کرایه</p>
                ) : (
                  <Toman className="fill-accent-green text-accent-green">
                    <p>{(shippingPrice / 10).toLocaleString('fa-IR')}</p>
                  </Toman>
                )
              ) : user ? (
                <p className="text-gray-500">آدرس یا نحوه ارسال تعیین نشده</p>
              ) : (
                <p className="text-gray-500">لطفا ابتدا وارد حساب شوید.</p>
              )}
            </div>
            <div className="flex flex-wrap border-t gap-2 text-sm">
              <p>جمع کل:</p>

              <Toman className="fill-accent-green text-accent-green">
                <p>
                  {(
                    (shippingPrice > 0 ? shippingPrice : 0) / 10 +
                    price / 10
                  ).toLocaleString('fa-IR')}
                </p>
              </Toman>
            </div>
            <SubmitButton
              link="/cart/checkout/payment"
              disabled={
                !showNext ||
                !user ||
                !checkoutAddress ||
                !checkoutAddress.cityCode
              }
            >
              ثبت سفارش
            </SubmitButton>
          </div>
        </div>
      </div>
    </>
  );
}
