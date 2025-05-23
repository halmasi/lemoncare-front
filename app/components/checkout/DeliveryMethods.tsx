import { useCheckoutStore } from '@/app/utils/states/useCheckoutData';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import Image from 'next/image';

import PostLogo from '@/public/iranPost.svg';
import ChaparLogo from '@/public/chapar.svg';
import TipaxLogo from '@/public/tipax.svg';
import { calcShippingPrice } from '@/app/utils/paymentUtils';
import RadioButton from '../formElements/RadioButton';
import { toast } from 'react-toastify';
import LoadingAnimation from '../LoadingAnimation';

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

  useEffect(() => {
    getMethodsFn.mutateAsync();
  }, []);

  useEffect(() => {
    setShippingPrice(0);
    if (selected && checkoutAddress && checkoutAddress.cityCode) {
      setError('');
      setShippingPrice(0);
      getPriceFn.mutateAsync(checkoutAddress.cityCode);
      setShippingOption({
        courier_code: selected.courierCode,
        service_type: selected.courierServiceCode,
      });
    }
    if (selected && (!checkoutAddress || !checkoutAddress.cityCode)) {
      setShippingPrice(0);
      setError('لطفا ابتدا آدرس خود را وارد کنید.');
    }
  }, [selected, checkoutAddress, checkoutAddress?.cityCode]);

  const getMethodsFn = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/checkout');
      const data: GetMethodsProps = await res.json();
      return data;
    },
    onSuccess: (data) => {
      if (data.isSuccess && data.data[0].courierCode) {
        data.data.map((item) => {
          if (
            (item.courierCode == 'IR_POST' ||
              item.courierCode == 'CHAPAR' ||
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
      } else throw Error();
    },
    onError: () => {
      toast.warn('خطا در دریافت روش های ارسال');
    },
  });
  const getPriceFn = useMutation({
    mutationFn: async (cityCode: number) => {
      const data = await calcShippingPrice(
        cityCode,
        selected,
        beforePrice,
        200
      );
      return data;
    },
    onSuccess: (data) => {
      if (
        !data.isSuccess ||
        !data.data.servicePrices[0] ||
        !data.data.servicePrices[0].totalPrice
      )
        throw Error();
      const neededData = data.data.servicePrices[0];
      setShippingPrice(Math.ceil(neededData.totalPrice / 10000) * 10000);
      onChangeFn(true);
    },
    onError: () => {
      onChangeFn(false);
      setShippingPrice(0);
      toast.warn('خطا در دریافت قیمت ارسال، روش دیگری را انتخاب کنید');
    },
  });

  if (getMethodsFn.isPending)
    return (
      <div>
        <LoadingAnimation />
      </div>
    );

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
                    : item.courierCode == 'CHAPAR'
                      ? ChaparLogo.src
                      : TipaxLogo.src
                }
                alt={item.courierName}
                width={50}
                height={50}
                className={`w-[65%] h-[65%]`}
              />
              <div className="flex flex-col h-fit text-center rounded-xl bg-foreground/10 w-full text-foreground font-bold">
                <p className="text-xs text-accent-green">{item.courierName}</p>
                <p>{item.courierServiceName}</p>
              </div>
            </div>
          </RadioButton>
        ))}
      </div>
    </div>
  );
}
