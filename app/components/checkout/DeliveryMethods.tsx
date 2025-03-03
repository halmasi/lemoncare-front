import { useCheckoutStore } from '@/app/utils/states/useCheckoutData';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Toman from '../Toman';
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
export default function DeliveryMethods() {
  const [courier, setCourier] = useState<CourierProps[]>([]);
  const [selected, setSelected] = useState<CourierProps>(courier[0]);
  const [shipingPrice, SetShipingPrice] = useState(0);

  const { checkoutAddress, beforePrice } = useCheckoutStore();

  const router = useRouter();
  useEffect(() => {
    (async () => {
      const res = await fetch('/api/checkout');
      const data: GetMethodsProps = await res.json();
      if (data.isSuccess && data.data[0].courierCode) {
        data.data.map((item) => {
          if (
            item.courierName == 'شرکت ملی پست' ||
            item.courierName == 'تیپاکس' ||
            item.courierName == 'چاپار'
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
          total_weight: 500,
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
      SetShipingPrice(neededData.totalPrice / 10);
    },
  });

  useEffect(() => {
    if (selected && checkoutAddress && checkoutAddress.cityCode)
      getPrice.mutate(checkoutAddress.cityCode);
  }, [selected]);

  return (
    <div key={courier.length}>
      <div className="flex gap-2 items-center">
        {shipingPrice != 0 && (
          <>
            <h6>هزینه ارسال:</h6>
            <Toman className="fill-accent-green text-accent-green">
              <p>
                {(Math.ceil(shipingPrice / 1000) * 1000).toLocaleString(
                  'fa-IR'
                )}
              </p>
            </Toman>
          </>
        )}
      </div>
      <div className="flex flex-wrap">
        {courier.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              setSelected(item);
            }}
            className={`p-2 text-center rounded-lg border m-2 aspect-square w-40 ${selected == item && 'bg-accent-pink/20 hover:bg-accent-pink/20'} hover:bg-gray-200 ${getPrice.isPending && 'cursor-wait'}`}
          >
            <p className="text-xs">{item.courierName}</p>
            <p>{item.courierServiceName}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
