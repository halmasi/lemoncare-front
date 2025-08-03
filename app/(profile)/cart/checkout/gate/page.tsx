'use client';

import LoadingAnimation from '@/app/components/LoadingAnimation';
import Title from '@/app/components/Title';
import { emptyCart } from '@/app/utils/actions/cartActionMethods';
import config from '@/app/utils/config';
import { getSingleOrderHistory } from '@/app/utils/data/getUserInfo';
import { getPaymentToken } from '@/app/utils/paymentUtils';
import { OrderHistoryProps } from '@/app/utils/schema/userProps';
import { useCartStore } from '@/app/utils/states/useCartData';
import { useCheckoutStore } from '@/app/utils/states/useCheckoutData';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BiCopy } from 'react-icons/bi';
import { VscLoading } from 'react-icons/vsc';
import { toast } from 'react-toastify';

function SizPayRedirect({ token }: { token: string }) {
  useEffect(() => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://rt.sizpay.ir/Route/Payment';

    const ParamEntries = {
      MerchantID: config.sizpayMerchantId || '',
      TerminalID: config.sizpayTerminalId || '',
      Token: token,
    };

    Object.entries(ParamEntries).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  }, [token]);

  return (
    <>
      <LoadingComponent />
    </>
  );
}

function LoadingComponent() {
  return (
    <div className="flex flex-col items-center justify-start w-full">
      <LoadingAnimation />
      <p>در حال انتقال به درگاه پرداخت</p>
      <p>لطفا منتظر بمانید</p>
    </div>
  );
}

export default function GatePage() {
  const [orderInfo, setOrderInfo] = useState<OrderHistoryProps>();
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [Token, setToken] = useState<string>();

  const {
    paymentOption,
    setShippingPrice,
    setShippingOption,
    setBeforePrice,
    setPrice,
    orderCode,
    orderHistoryCheckout,
    setOrderHistoryCheckout,
  } = useCheckoutStore();
  const { resetCart } = useCartStore();
  const { user } = useDataStore();

  const getPriceFn = useMutation({
    mutationFn: async () => {
      const order = await getSingleOrderHistory(orderCode);
      if (order) {
        return order;
      }
    },
    onSuccess: async (data) => {
      if (!data) return;
      setOrderInfo(data);
      setTotalPrice(parseInt(data.order.totalPrice.toString()));

      if (user && !orderHistoryCheckout) {
        resetCart();
        setShippingPrice(-1);
        setShippingOption({
          courier_code: '',
          service_name: '',
          service_type: '',
        });
        setBeforePrice(0);
        setPrice(0);
        setOrderHistoryCheckout(false);
        await emptyCart(user.shopingCart.documentId);
      }
    },
    onError: () => {},
  });

  const getTokenFn = useMutation({
    mutationFn: async () => {
      if (orderInfo && user) {
        const res = await getPaymentToken({
          email: user.email || '',
          orderInfo,
          totalPrice,
        });
        return res;
      }
    },
    onSuccess: async (data) => {
      if (!data || !(data.ResCod == 0 || data.ResCod == parseInt('00'))) {
        toast.error('خطا در انتقال به درگاه پرداخت');
        return;
      }
      setOrderHistoryCheckout(false);
      const Token = data.Token;
      setToken(Token);
    },
    onError: (err) => {
      toast.error('خطا در انتقال به درگاه پرداخت');
      console.log(err.message);
    },
  });

  useEffect(() => {
    if (orderCode) {
      getPriceFn.mutate();
    }
  }, [orderCode]);

  useEffect(() => {
    if (paymentOption == 'online' && totalPrice > 0) {
      getTokenFn.mutate();
    }
  }, [totalPrice, paymentOption]);

  if (paymentOption == 'online')
    return (
      <>{Token ? <SizPayRedirect token={Token} /> : <LoadingComponent />}</>
    );
  if (paymentOption == 'offline')
    return (
      <div>
        <Title>
          <h5 className="text-accent-pink">پرداخت به صورت کارت به کارت</h5>
        </Title>
        <br />
        <div className="flex flex-wrap items-center justify-center gap-2">
          <p>لطفا مبلغ</p>{' '}
          {getPriceFn.isPending || totalPrice == 0 ? (
            <VscLoading className="animate-spin text-accent-green" />
          ) : (
            <p className="text-accent-green">
              <span>
                {totalPrice.toLocaleString('fa-IR', {
                  style: 'decimal',
                  maximumFractionDigits: 0,
                })}{' '}
              </span>
              ریال
            </p>
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
            <p>5041-7210-8182-4998</p>
            <p>به نام حسین الماسی</p>
          </div>
        </div>
        <p>
          سپس فیش واریزی را همراه کد سفارش{' '}
          <Link
            href={'/dashboard/orderhistory/' + orderCode}
            className="text-accent-pink underline bg-accent-green/20"
          >
            {orderCode}
          </Link>{' '}
          به شماره{' '}
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
