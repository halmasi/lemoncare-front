'use client';

import { useCheckoutStore } from '@/app/utils/states/useCheckoutData';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import Image from 'next/image';

import PostLogo from '@/public/iranPost.svg';
// import ChaparLogo from '@/public/chapar.svg';
import TipaxLogo from '@/public/tipax.svg';
import { calcShippingPrice } from '@/app/utils/paymentUtils';
import RadioButton from '../formElements/RadioButton';
import { toast } from 'react-toastify';
import LoadingAnimation from '../LoadingAnimation';
import { useDataStore } from '@/app/utils/states/useUserdata';

export interface CourierProps {
  courierCode: string;
  courierName: string;
  courierServiceId: number;
  courierServiceName: string;
  courierServiceCode: string;
  days: string;
  slaHours: number;
  taxPercent: number;
}
interface GetMethodsProps {
  isSuccess: boolean;
  data: CourierProps[];
}
export interface PostMethodsProps {
  isSuccess: boolean;
  data: {
    optionalServices: object;
    servicePrices: {
      courierName: string;
      courierCode: string;
      serviceType: string;
      serviceName: string;
      slaDays: string;
      slaHours: number;
      vat: number;
      discountAmount: number;
      totalPrice: number;
      initPrice: number;
    }[];
  };
}
export default function DeliveryMethods({
  onChangeFn,
}: {
  onChangeFn: (isSelected: boolean) => void;
}) {
  const [courier, setCourier] = useState<CourierProps[]>([]);
  const [selected, setSelected] = useState<CourierProps>(courier[0]);
  const [error, setError] = useState<string>('');

  const { checkoutAddress, beforePrice, setShippingOption, setShippingPrice } =
    useCheckoutStore();

  const { user } = useDataStore();

  useEffect(() => {
    getMethodsFn.mutate();
  }, []);

  useEffect(() => {
    setShippingPrice(-1);
    if (selected && checkoutAddress && checkoutAddress.cityCode) {
      setError('');
      setShippingPrice(-1);
      getPriceFn.mutate(checkoutAddress.cityCode);
      setShippingOption({
        courier_code: selected.courierCode,
        service_type: selected.courierServiceCode,
        service_name:
          selected.courierName + ' | ' + selected.courierServiceName,
      });
    }
    // toast.info(selected.courierName + ' | ' + selected.courierServiceName);
    if (selected && (!checkoutAddress || !checkoutAddress.cityCode)) {
      setShippingPrice(-1);
      setError(
        user
          ? 'لطفا ابتدا آدرس خود را وارد کنید.'
          : 'لطفا ابتدا وارد حساب شوید.'
      );
    }
  }, [selected, checkoutAddress, checkoutAddress?.cityCode]);

  const getMethodsFn = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/checkout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data: GetMethodsProps = await res.json();
      return data;
    },
    onSuccess: (data) => {
      if (
        !data ||
        !data.isSuccess ||
        !data.data ||
        data.data.length <= 0 ||
        !data.data[0].courierCode
      ) {
        toast.warn('خطا در دریافت روش های ارسال');
        return;
      }
      data.data.map((item) => {
        if (
          (item.courierCode == 'IR_POST' ||
            // item.courierCode == 'CHAPAR' ||
            item.courierCode == 'TIPAX') &&
          item.courierServiceCode != 'CERTIFIED'
        ) {
          setCourier((prev) => {
            const copy = prev;
            copy.push(item);
            return copy;
          });
        }
      });
    },
    onError: () => {
      toast.warn('خطا در دریافت روش های ارسال');
    },
    retry: 5,
    retryDelay: 1000,
  });
  const getPriceFn = useMutation({
    mutationFn: async (cityCode: number) => {
      const data = await calcShippingPrice(
        cityCode,
        {
          courierCode: selected.courierCode,
          courierServiceCode: selected.courierServiceCode,
        },
        beforePrice,
        200
      );
      return data;
    },
    onSuccess: (data) => {
      if (
        !data.isSuccess ||
        !data.data.servicePrices[0] ||
        data.data.servicePrices[0].totalPrice < 0
      ) {
        toast.warn('خطا در دریافت هزینه ارسال، روش دیگری را انتخاب کنید');
        onChangeFn(false);
        setShippingPrice(-1);
        return;
      }
      const neededData = data.data.servicePrices[0];
      if (neededData.totalPrice == 0) setShippingPrice(0);
      else setShippingPrice(Math.ceil(neededData.totalPrice / 10000) * 10000);
      onChangeFn(true);
    },
    onError: () => {
      onChangeFn(false);
      setShippingPrice(-1);
      toast.warn('خطا در دریافت قیمت ارسال، روش دیگری را انتخاب کنید');
    },
  });

  if (getMethodsFn.isPending)
    return (
      <div>
        <LoadingAnimation />
      </div>
    );

  if (courier && courier.length != 0)
    return (
      <div key={courier.length}>
        <p className="text-red-700">{error}</p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {courier.map((item, index) => (
            <RadioButton
              key={index}
              id={item.courierCode}
              onClick={() => {
                setSelected(item);
              }}
              isSelected={selected == item}
              className="flex-col items-center h-52 w-52 aspect-square gap-2 rounded-2xl"
            >
              <div className="flex flex-col w-full justify-between items-center h-[80%]">
                <Image
                  src={
                    item.courierCode == 'IR_POST'
                      ? PostLogo
                      : // : item.courierCode == 'CHAPAR'
                        //   ? ChaparLogo.src
                        TipaxLogo.src
                  }
                  alt={item.courierName}
                  width={50}
                  height={50}
                  className={`w-[65%] h-[65%]`}
                />
                <div className="flex flex-col h-fit text-center rounded-xl bg-foreground/10 w-full text-foreground font-bold">
                  <p className="text-xs text-accent-green">
                    {item.courierName}
                  </p>
                  <p>{item.courierServiceName}</p>
                </div>
              </div>
            </RadioButton>
          ))}
        </div>
      </div>
    );
}
