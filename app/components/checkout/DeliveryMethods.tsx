import { useCheckoutStore } from '@/app/utils/states/useCheckoutData';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import Image from 'next/image';

import PostLogo from '@/public/Iran-Post-Logo.svg';
import ChaparLogo from '@/public/chaparLogo.png';
import { calcShippingPrice } from '@/app/utils/paymentUtils';
import RadioButton from '../formElements/RadioButton';

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
    (async () => {
      const res = await fetch('/api/checkout');
      const data: GetMethodsProps = await res.json();
      if (data.isSuccess && data.data[0].courierCode) {
        data.data.map((item) => {
          if (
            (item.courierCode == 'IR_POST' || item.courierCode == 'CHAPAR') &&
            item.courierServiceCode != 'CERTIFIED'
          ) {
            setCourier((prev) => {
              const copy = prev;
              copy.push(item);
              return copy;
            });
          }
        });
      }
    })();
  }, []);

  const getPrice = useMutation({
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
      const neededData = data.data.servicePrices[0];
      setShippingPrice(Math.ceil(neededData.totalPrice / 10000) * 10000);

      onChangeFn(true);
    },
    onError: () => {
      onChangeFn(false);
      setShippingPrice(0);
    },
  });

  useEffect(() => {
    setShippingPrice(0);
    if (selected && checkoutAddress && checkoutAddress.cityCode) {
      setError('');
      setShippingPrice(0);
      getPrice.mutate(checkoutAddress.cityCode);
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
            className="flex flex-col items-center justify-center w-52 aspect-square"
          >
            <div className="flex flex-col text-center gap-2">
              <Image
                src={item.courierCode == 'IR_POST' ? PostLogo : ChaparLogo.src}
                alt={item.courierName}
                width={100}
                height={100}
              />
              <div>
                <p className="text-xs">{item.courierName}</p>
                <p>{item.courierServiceName}</p>
              </div>
            </div>
          </RadioButton>
        ))}
      </div>
    </div>
  );
}
