'use client';
import PaymentSelector from '@/app/components/checkout/PaymentSelector';
import SubmitButton from '@/app/components/formElements/SubmitButton';
import Toman from '@/app/components/Toman';
import { useCheckoutStore } from '@/app/utils/states/useCheckoutData';

export default function Payment() {
  const {
    beforePrice,
    // cartId,
    // checkoutAddress,
    price,
    paymentOption,
    setPaymentOption,
    // shippingOption,
    shippingPrice,
  } = useCheckoutStore();
  return (
    <>
      <div className="flex flex-col lg:flex-row w-full gap-2">
        <div className="w-full lg:w-1/2 flex flex-col bg-background rounded-lg border items-center">
          <h5 className="font-bold">شیوه پرداخت</h5>
          <PaymentSelector
            onPaymentMethodChange={(method) => setPaymentOption(method)}
          />
        </div>
        <div className=" w-full lg:w-1/2 bg-gray-200 rounded-lg border p-10">
          <div className="zigzag flex flex-col items-start w-full pb-10">
            <div className="w-full flex gap-2 p-1 md:pr-10">
              <div className="flex flex-wrap w-full gap-2">
                <h6 className="w-fit">مبلغ سفارش:</h6>
                <Toman className="line-through fill-gray-500 text-gray-500">
                  <p className=" text-sm">
                    {(beforePrice / 10).toLocaleString('fa-IR', {
                      style: 'decimal',
                      maximumFractionDigits: 0,
                    })}
                  </p>
                </Toman>
                <Toman className="fill-accent-green text-accent-green">
                  {(price / 10).toLocaleString('fa-IR', {
                    style: 'decimal',
                    maximumFractionDigits: 0,
                  })}{' '}
                </Toman>
              </div>
            </div>
            <div className="flex justify-center items-center gap-2 text-accent-pink p-1 md:pr-10">
              <p className="w-fit text-sm self-start">تخفیف: </p>
              <p className="w-fit text-sm self-start">
                {' '}
                {((1 - price / beforePrice) * 100).toLocaleString('fa-IR', {
                  style: 'decimal',
                  maximumFractionDigits: 0,
                })}{' '}
                %
              </p>
            </div>
            <div className="border  w-full my-2" />
            <div className="flex flex-wrap  items-center gap-2 p-1 md:pr-10">
              <h6 className="w-fit self-start">هزینه ارسال:</h6>
              <Toman className="fill-accent-green text-accent-green">
                {(shippingPrice / 10).toLocaleString('fa-IR', {
                  style: 'decimal',
                  maximumFractionDigits: 0,
                })}
              </Toman>
            </div>
            <div className="border  w-full my-2" />
            <div className="flex flex-wrap gap-2 p-1 md:pr-10">
              <h5 className="w-fit self-center">مبلغ نهایی:</h5>
              <Toman className="fill-accent-green text-accent-green">
                <h6 className="">
                  {((price + shippingPrice) / 10).toLocaleString('fa-IR', {
                    style: 'decimal',
                    maximumFractionDigits: 0,
                  })}
                </h6>
              </Toman>
            </div>
          </div>
          <div className="items-center justify-center flex flex-col gap-2 pt-5">
            {paymentOption == 'online' ? (
              <SubmitButton>پرداخت آنلاین</SubmitButton>
            ) : (
              <SubmitButton>ثبت سفارش</SubmitButton>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
