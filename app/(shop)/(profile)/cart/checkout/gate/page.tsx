'use client';

import LoadingAnimation from '@/app/components/LoadingAnimation';
import Toman from '@/app/components/Toman';
import { calcShippingPrice } from '@/app/utils/paymentUtils';
import { varietyFinder } from '@/app/utils/shopUtils';
import { useCartStore } from '@/app/utils/states/useCartData';
import { useCheckoutStore } from '@/app/utils/states/useCheckoutData';
// import { useDataStore } from '@/app/utils/states/useUserdata';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BiCopy } from 'react-icons/bi';
import { VscLoading } from 'react-icons/vsc';
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

  const router = useRouter();

  useEffect(() => {
    if (shippingPrice < 0) {
      router.push('/cart/checkout');
    }
  }, [shippingPrice]);
  useEffect(() => {
    if (cart && cart.length > 0 && !finalPrice) {
      let cartPrice = 0;
      cart.map((item) => {
        const product = cartProducts.find(
          (i) => i.documentId == item.product.documentId
        );
        if (product) {
          const info = varietyFinder(item.variety, product);
          const total = info.mainPrice * item.count;
          cartPrice += total;
        }
      });
      setPrice(cartPrice);
    }
  }, [
    cart,
    paymentOption,
    shippingOption,
    checkoutAddress,
    setFinalPrice,
    setPrice,
    price,
  ]);

  useEffect(() => {
    if (price) getShippingPriceFn.mutateAsync();
  }, [price]);

  useEffect(() => {
    if (totalPrice && paymentOption == 'online') {
      router.push('https://digikala.com');
    }
  }, [totalPrice, paymentOption]);

  ///mutation
  const getShippingPriceFn = useMutation({
    mutationFn: async () => {
      if (checkoutAddress && checkoutAddress.cityCode) {
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
      if (
        !data ||
        !data.data.servicePrices[0] ||
        !data.data.servicePrices[0].totalPrice
      ) {
        toast('خطا! یک روش ارسال دیگر انتخاب کنید');
        return;
      }
      setShippingPrice(
        Math.ceil(data.data.servicePrices[0].totalPrice / 10000) * 10000
      );
      setTotalPrice(shippingPrice + price);
    },
  });

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
        <br />
        <div className="flex flex-wrap items-center justify-center gap-2">
          <p>لطفا مبلغ</p>{' '}
          {getShippingPriceFn.isPending || totalPrice == 0 ? (
            <VscLoading className="animate-spin text-accent-green" />
          ) : (
            <Toman className="fill-accent-green text-accent-green">
              <p>
                {(totalPrice / 10).toLocaleString('fa-IR', {
                  style: 'decimal',
                  maximumFractionDigits: 0,
                })}
              </p>
            </Toman>
          )}{' '}
          <p>را به شماره کارت زیر واریز کنید:</p>
        </div>

        <div
          onClick={() => {
            navigator.clipboard.writeText('60377011112222');
            toast('شماره کارت کپی شد.');
          }}
          className="p-2 bg-gray-100 rounded-lg flex flex-col cursor-pointer border-2"
        >
          <div className="flex gap-1 absolute text-gray-500">
            <BiCopy />
            <p className="text-sm">برای کپی کلیک کنید</p>
          </div>
          <div className="flex flex-col items-center justify-center pt-3 md:pt-0">
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
          <a href="#1" className="text-accent-green">
            ایتا،
          </a>{' '}
          <a href="#2" className="text-accent-green">
            روبیکا،
          </a>{' '}
          <a href="#3" className="text-accent-green">
            واتساپ
          </a>{' '}
          <a href="#4" className="text-accent-green">
            و یا تلگرام
          </a>{' '}
          ارسال کنید.
        </p>
      </div>
    );
}
