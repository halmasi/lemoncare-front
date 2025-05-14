'use client';

import LoadingAnimation from '@/app/components/LoadingAnimation';
import Toman from '@/app/components/Toman';
import { calcShippingPrice } from '@/app/utils/paymentUtils';
import { varietyFinder } from '@/app/utils/shopUtils';
import { useCartStore } from '@/app/utils/states/useCartData';
import { useCheckoutStore } from '@/app/utils/states/useCheckoutData';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { BiCopy } from 'react-icons/bi';
import { toast } from 'react-toastify';

export default function page() {
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const {
    paymentOption,
    shippingOption,
    checkoutAddress,
    setShippingPrice,
    shippingPrice,
    price,
    setPrice,
  } = useCheckoutStore();
  const { cart, cartProducts } = useCartStore();
  //   const { user, jwt } = useDataStore();
  const getShippingPriceFn = useMutation({
    mutationFn: async () => {
      if (checkoutAddress?.cityCode) {
        const res = await calcShippingPrice(
          checkoutAddress?.cityCode,
          {
            courierCode: shippingOption.courier_code,
            courierServiceCode: shippingOption.service_type,
          },
          price,
          200
        );
        return res;
      }
    },
    onSuccess: (data) => {
      if (!data) return;
      setShippingPrice(
        Math.ceil(data.data.servicePrices[0].totalPrice / 10000) * 10000
      );
      setTotalPrice(shippingPrice + price);
    },
  });

  useEffect(() => {
    if (cart && cart.length > 0) {
      cart.map((item) => {
        const product = cartProducts.find(
          (i) => i.documentId == item.product.documentId
        );
        if (product) {
          const info = varietyFinder(item.variety, product);
          setFinalPrice((prev) => prev + info.mainPrice * item.count);
        }
      });
      setPrice(finalPrice);
      getShippingPriceFn.mutateAsync();
    }
  }, [cart, paymentOption, shippingOption]);

  if (paymentOption == 'online')
    return (
      <div className="flex flex-col items-center justify-start w-full">
        <LoadingAnimation />
        <p>در حال انتقال به درگاه پرداخت</p>
        <p>لطفا منتظر بمانید</p>
      </div>
    );
  if (paymentOption == 'offline')
    return (
      <div>
        <h1 className="text-2xl font-bold">پرداخت به صورت کارت به کارت</h1>
        <p>
          لطفا مبلغ{' '}
          <Toman>
            {(totalPrice / 10).toLocaleString('fa-IR', {
              style: 'decimal',
              maximumFractionDigits: 0,
            })}
          </Toman>{' '}
          را به شماره کارت زیر واریز کنید:
        </p>

        <div
          onClick={() => {
            navigator.clipboard.writeText('60377011112222');
            toast('شماره کارت کپی شد.');
          }}
          className="p-2 bg-gray-100 rounded-lg flex flex-col"
        >
          <BiCopy className="absolute" />
          <div className="flex flex-col items-center justify-center">
            <p>شماره کارت:</p>
            <p>6037-7011-1111-2222</p>
          </div>
        </div>
        <p>
          سپس فیش واریزی را به شماره{' '}
          <a className="text-accent-pink" href="tel:09025548887">
            09025548887
          </a>{' '}
          در پیام رسان{' '}
          <span className="text-accent-green">
            ایتا، روبیکا، واتساپ و یا تلگرام
          </span>{' '}
          ارسال کنید.
        </p>
      </div>
    );
}
