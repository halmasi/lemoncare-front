import qs from 'qs';
import { dataFetch } from './dataFetch';
import { CartProps } from '../schema/shopProps';

export const checkCoupon = async ({
  coupon,
  cart,
}: {
  coupon: string;
  cart: CartProps[];
}) => {
  const query = qs.stringify({
    filters: { couponCode: { $eq: coupon } },
    populate: '*',
  });
  const res = await dataFetch({
    qs: `/coupons?${query}`,
  });
  let whichKind: 'shop.coupon-shipping' | 'shop.coupon-price' | 'shop.coupon' =
    'shop.coupon';
  const kind:
    | { __component: 'shop.coupon'; percentage: number; leastAmount: number }[]
    | {
        __component: 'shop.coupon-shipping';
        percentage: number;
        leastAmount: number;
      }[]
    | {
        __component: 'shop.coupon-price';
        discountPrice: number;
        leastAmount: number;
      }[] = res.data[0].kind;

  kind.forEach((key: object) => {
    Object.keys(key).forEach((item) => {
      if (item == '__component') whichKind = (key as any)[item];
    });
  });
  if (whichKind == 'shop.coupon') {
    console.log('persentage');
  } else if (whichKind == 'shop.coupon-shipping') {
    console.log('shipping');
  } else if (whichKind == 'shop.coupon-price') {
    console.log('price');
  }
  //   console.log(res.data[0].kind.__component);
  return res;
};
