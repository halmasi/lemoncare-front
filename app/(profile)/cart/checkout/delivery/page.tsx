'use client';

import DeliveryMethods from '@/app/components/checkout/DeliveryMethods';
import SubmitButton from '@/app/components/formElements/SubmitButton';
import Title from '@/app/components/Title';
import Toman from '@/app/components/Toman';
import { useCheckoutStore } from '@/app/utils/states/useCheckoutData';
import { useDataStore } from '@/app/utils/states/useUserdata';
import Link from 'next/link';
import { useState } from 'react';
import { FaArrowRightLong } from 'react-icons/fa6';

export default function DeliveryPage() {
  const {
    price,
    beforePrice,
    shippingPrice,
    setCoupon,
    shippingOption,
    checkoutAddress,
  } = useCheckoutStore();

  const { user } = useDataStore();

  const [showNext, setShowNext] = useState<boolean>(false);

  return (
    <div className="w-full flex flex-col justify-between">
      <div className="flex ">
        <Link
          href={'/cart/checkout'}
          className="absolute hover:text-accent-pink self-start md:self-center md:justify-self-start transition-colors w-fit p-2 border-l"
        >
          <FaArrowRightLong />
        </Link>
        <Title className="pr-10">
          <h6>انتخاب روش ارسال</h6>
        </Title>
      </div>
      <div className="w-full flex justify-between">
        <div className="w-full lg:w-9/12">
          {user && checkoutAddress && (
            <div className="flex flex-col gap-5 w-full p-2 lg:p-5 rounded-lg bg-gray-50/50 border min-h-svh">
              <Title>
                <h6 className="text-accent-pink">روش ارسال:</h6>
              </Title>
              <DeliveryMethods
                onChangeFn={(isSelected: boolean) => {
                  setShowNext(isSelected);
                }}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 h-fit w-full lg:w-3/12 lg:sticky lg:top-5">
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
                  {beforePrice > 0 && price / 10}
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
                shippingOption.courier_code == 'TIPAX' ||
                shippingOption.courier_code == 'ALUPAYK' ||
                shippingOption.courier_code == 'SNAPPPAYK' ? (
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
              onClick={() => {
                setCoupon('');
              }}
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
    </div>
  );
}
