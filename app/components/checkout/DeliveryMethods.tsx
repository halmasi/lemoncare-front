import { useCheckoutStore } from '@/app/utils/states/useCheckoutData';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Toman from '../Toman';
import Image from 'next/image';

import PostLogo from '@/public/Iran-Post-Logo.svg';
import ChaparLogo from '@/public/chaparLogo.png';

interface CourierProps {
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
interface PostMethodsProps {
  isSuccess: boolean;
  data: {
    optionalServices: {};
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
  // const [shippingPrice, SetShippingPrice] = useState(0);
  const [error, setError] = useState<string>('');
  const { checkoutAddress, beforePrice, setShippingOption, setShippingPrice } =
    useCheckoutStore();

  const router = useRouter();
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
        router.refresh();
      }
    })();
  }, []);

  const getPrice = useMutation({
    mutationFn: async (cityCode: number) => {
      const body = {
        courier: {
          courier_code: selected.courierCode,
          service_type: selected.courierServiceCode,
          payment_type: 'SENDER',
        },
        from_city_code: 286,
        to_city_code: cityCode,
        parcel_properties: {
          height: 35,
          width: 25,
          length: 25,
          box_type_id: 8,
          total_weight: 200,
          total_value: beforePrice,
        },
        has_collection: true,
        has_distribution: true,
        value_added_service: [0],
      };
      const res = await fetch('/api/checkout', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      const data: PostMethodsProps = await res.json();
      return data;
    },
    onSuccess: (data) => {
      const neededData = data.data.servicePrices[0];
      setShippingPrice(neededData.totalPrice);
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
  }, [selected]);

  return (
    <div key={courier.length}>
      <p className="text-red-700">{error}</p>
      <div className="flex flex-wrap items-center justify-center">
        {courier.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              setSelected(item);
            }}
            className={`flex flex-col p-2 text-center justify-between items-center rounded-lg border m-2 aspect-square w-40 ${selected == item && 'bg-accent-pink/20 hover:bg-accent-pink/20'} hover:bg-gray-200 ${getPrice.isPending && 'cursor-wait'}`}
          >
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
          </button>
        ))}
      </div>
    </div>
  );
}
