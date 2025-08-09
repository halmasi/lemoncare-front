'use server';

import { PostMethodsProps } from '@/app/components/checkout/DeliveryMethods';
import { CartProps } from './schema/shopProps';
import { AddressProps, OrderHistoryProps } from './schema/userProps';
import { convertPersianAndArabicToEnglish } from './miniFunctions';
import config from './config';

// export const paymentMethod = async (amount: number) => {};

export const getPaymentToken = async ({
  orderInfo,
  totalPrice,
  email,
}: {
  orderInfo: OrderHistoryProps;
  totalPrice: number;
  email: string;
}) => {
  const date = new Date();

  const res = await fetch(
    'https://rt.sizpay.ir/api/PaymentSimple/GetTokenSimple',
    {
      method: 'POST',
      body: JSON.stringify({
        username: config.sizpayUsername,
        password: config.sizpayPassword,
        MerchantID: config.sizpayMerchantId,
        TerminalID: config.sizpayTerminalId,
        Amount: totalPrice,
        DocDate: convertPersianAndArabicToEnglish(
          date.toLocaleDateString('fa-IR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })
        ),
        OrderID: orderInfo.order.orderCode,
        ReturnURL: `${config.siteUrl}/api/checkout/callback`,
        ExtraInf: '',
        InvoiceNo: orderInfo.order.orderCode,
        AppExtraInf: {
          PayerNm:
            (orderInfo?.order.firstName || '') +
            (orderInfo?.order.lastName || ''),
          PayerMobile: orderInfo?.order.mobileNumber || '',
          PayerEmail: email || '',
          Descr: '',
          PayerIP: '',
          PayTitle: 'پرداخت سفارش lemiro',
          PayerNCode: '',
        },
        SignData: '',
      }),
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': '' + config.sizpayToken,
      },
    }
  );
  const data = await res.json();
  return data;
};

export const submitOrder = async ({
  user,
  jwt,
  items,
  checkoutAddress,
  paymentOption,
  shippingOption,
  shippingPrice,
  price,
  totalPrice,
  coupon,
}: {
  user: number;
  jwt: string;
  items: CartProps[];
  checkoutAddress: AddressProps;
  paymentOption: string;
  shippingOption: string;
  shippingPrice: number;
  price: number;
  totalPrice: number;
  coupon: string | null;
}) => {
  const date = new Date();

  const res = await fetch(`${config.siteUrl}/api/checkout/submit-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user: user,
      jwt,
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
        address: checkoutAddress!.address,
        province: checkoutAddress!.province,
        city: checkoutAddress!.city,
        firstName: checkoutAddress!.firstName,
        lastName: checkoutAddress!.lastName,
        mobileNumber: checkoutAddress!.mobileNumber,
        phoneNumber: checkoutAddress?.phoneNumber,
        postCode: checkoutAddress?.postCode,
        paymentStatus: 'pending',
        payMethod: paymentOption,
        shippingMethod: shippingOption,
        shippingPrice,
        orderPrice: price,
        totalPrice,
        coupon,
      },
    }),
  });
  const result = await res.json();

  return result;
};

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
    const res = await fetch(`${config.siteUrl}/api/checkout`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    const data: PostMethodsProps = await res.json();
    return data;
  } catch (e) {
    throw Error('Error: ' + e);
  }
};
