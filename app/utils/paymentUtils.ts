import { PostMethodsProps } from '@/app/components/checkout/DeliveryMethods';

// export const paymentMethod = async (amount: number) => {};

export const calcShippingPrice = async (
  cityCode: number,
  selected: { courierCode: string; courierServiceCode: string },
  price: number,
  weight: number
) => {
  if (selected.courierCode == 'TIPAX') {
    return {
      isSuccess: true,
      data: {
        optionalServices: {},
        servicePrices: [
          {
            courierName: 'TIPAX',
            courierCode: 'TIPAX',
            serviceType: 'TIPAX',
            serviceName: 'TIPAX',
            slaDays: 'none',
            slaHours: 0,
            vat: 0,
            discountAmount: 0,
            totalPrice: 0,
            initPrice: 0,
          },
        ],
      },
    };
  }
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
