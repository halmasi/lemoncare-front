'use client';
import PaymentSelector from '@/app/components/checkout/PaymentSelector';
import SubmitButton from '@/app/components/formElements/SubmitButton';
import Toman from '@/app/components/Toman';
import { calcShippingPrice } from '@/app/utils/paymentUtils';
import { CartProps } from '@/app/utils/schema/shopProps';
import { cartProductSelector, varietyFinder } from '@/app/utils/shopUtils';
import { useCartStore } from '@/app/utils/states/useCartData';
import { useCheckoutStore } from '@/app/utils/states/useCheckoutData';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ImInsertTemplate } from 'react-icons/im';
import { toast } from 'react-toastify';

export default function Payment() {
  const {
    beforePrice,
    price,
    setPrice,
    paymentOption,
    setPaymentOption,
    shippingPrice,
    shippingOption,
    checkoutAddress,
    setShippingPrice,
    coupon,
    setOrderCode,
  } = useCheckoutStore();

  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const { cart, cartProducts } = useCartStore();
  const { user, jwt } = useDataStore();

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
        data.data.servicePrices[0].totalPrice < 0
      ) {
        toast('خطا! یک روش ارسال دیگر انتخاب کنید');
        return;
      }
      setShippingPrice(
        Math.ceil(data.data.servicePrices[0].totalPrice / 10000) * 10000
      );
      setTotalPrice(shippingPrice + price);
      makeOrderHistoryFn.mutateAsync({ postMethod: shippingOption });
    },
  });

  const makeOrderHistoryFn = useMutation({
    mutationFn: async ({
      postMethod,
    }: {
      postMethod: { courier_code: string; service_type: string };
    }) => {
      const date = new Date();
      const items: CartProps[] = await Promise.all(
        cart.map(async (item) => {
          const product = await cartProductSelector(
            item.product.documentId,
            cartProducts
          );
          if (product) {
            const variety = varietyFinder(item.variety, product);
            return {
              count: item.count,
              product: item.product,
              variety: item.variety,
              beforePrice: variety.priceBefforDiscount,
              mainPrice: variety.mainPrice,
            };
          }
          return null;
        })
      ).then((results) => results.filter((item) => item !== null));
      const res = await fetch('/api/checkout/submit-order', {
        method: 'POST',
        body: JSON.stringify({
          id: user?.order_history.documentId,
          jwt: `Bearer ${jwt}`,
          order: {
            items: items.map((i: CartProps) => {
              return {
                count: i.count,
                product: i.product.documentId,
                variety: i.variety,
                beforePrice: i.beforePrice || 0,
                mainPrice: i.mainPrice || 0,
              };
            }),
            orderDate: date.toISOString(),
            address: checkoutAddress?.address,
            province: checkoutAddress?.province,
            city: checkoutAddress?.city,
            firstName: checkoutAddress?.firstName,
            lastName: checkoutAddress?.lastName,
            mobileNumber: checkoutAddress?.mobileNumber,
            phoneNumber: checkoutAddress?.phoneNumber,
            postCode: checkoutAddress?.postCode,
            paymentStatus: 'pending',
            payMethod: paymentOption,
            shippingMethod: shippingOption.service_name,
            shippingPrice,
            orderPrice: price,
            totalPrice,
            coupon,
          },
        }),
      });
      const result = await res.json();
      return result.data;
    },
    onSuccess: (data) => {
      setOrderCode(data.orderCode);
      router.push('/cart/checkout/gate');
    },
    onError: () => {
      toast.warn('خطایی رخ داده است');
    },
  });

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
                  <p>
                    {(price / 10).toLocaleString('fa-IR', {
                      style: 'decimal',
                      maximumFractionDigits: 0,
                    })}
                  </p>{' '}
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
            <hr className="w-full my-2" />
            <div className="flex flex-wrap  items-center gap-2 p-1 md:pr-10">
              <h6 className="w-fit self-start">هزینه ارسال:</h6>
              {shippingOption.courier_code == 'TIPAX' ? (
                <p className="text-accent-green">تیپاکس | پس کرایه</p>
              ) : (
                <Toman className="fill-accent-green text-accent-green">
                  <p>
                    {(shippingPrice / 10).toLocaleString('fa-IR', {
                      style: 'decimal',
                      maximumFractionDigits: 0,
                    })}
                  </p>
                </Toman>
              )}
            </div>
            <hr className="w-full my-2" />
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
            <SubmitButton
              isPending={makeOrderHistoryFn.isPending}
              onClick={() => {
                getShippingPriceFn.mutateAsync();
              }}
              // link="/cart/checkout/gate"
            >
              {paymentOption == 'online' ? 'پرداخت آنلاین' : 'ثبت سفارش'}
            </SubmitButton>
          </div>
        </div>
      </div>
    </>
  );
}
