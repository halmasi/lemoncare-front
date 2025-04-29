import {
  CourierProps,
  PostMethodsProps,
} from '@/app/components/checkout/DeliveryMethods';
import { logs } from './miniFunctions';

export const paymentMethod = async (amount: number) => {};

export const shippingPrice = async (
  cityCode: number,
  selected: CourierProps,
  price: number,
  weight: number
) => {
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
      total_weight: weight,
      total_value: price,
    },
    has_collection: true,
    has_distribution: true,
    value_added_service: [0],
  };
  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    const data: PostMethodsProps = await res.json();
    return data;
  } catch (e) {
    throw Error('Error: ' + e);
  }
};
