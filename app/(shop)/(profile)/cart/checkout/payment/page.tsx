'use client';
import PaymentSelector from '@/app/components/checkout/PaymentSelector';
import Toman from '@/app/components/Toman';
import { useCheckoutStore } from '@/app/utils/states/useCheckoutData';

export default function Payment() {
  const {
    beforePrice,
    cartId,
    checkoutAddress,
    price,
    paymentOption,
    setPaymentOption,
    shippingOption,
  } = useCheckoutStore();
  return (
    <>
      <div className="flex flex-col lg:flex-row w-full gap-2">
        <div className="w-full lg:w-1/2 flex flex-col bg-background rounded-lg border items-center">
          <h5 className="font-bold">شیوه پرداخت</h5>
          <PaymentSelector />
        </div>
        <div className="w-full lg:w-1/2 flex flex-col bg-background rounded-lg border">
          <p className="w-fit text-sm self-start">مبلغ سفارش:</p>
          <div className="flex gap-2 self-center">
            <div className="flex flex-wrap w-full gap-2">
              <Toman className="line-through fill-gray-500 text-gray-500">
                <p className=" text-sm">{beforePrice}</p>
              </Toman>
              <Toman className="fill-accent-green text-accent-green">
                {price}
              </Toman>
            </div>
          </div>
          <div className="flex justify-center items-center gap-2">
            <p className="w-fit text-sm self-start">درصد تخفیف: </p>
            <p className="w-fit text-sm self-start">
              {' '}
              {((1 - price / beforePrice) * 100).toLocaleString('fa-IR', {
                style: 'decimal',
                maximumFractionDigits: 0,
              })}{' '}
              %
            </p>
          </div>
          <p className="w-fit text-sm self-start">هزینه ارسال:</p>
          <p className="w-fit text-sm self-start">مبلغ نهایی:</p>
        </div>
      </div>
    </>
  );
}
