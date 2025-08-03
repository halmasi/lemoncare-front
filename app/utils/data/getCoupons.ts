import qs from 'qs';
import { dataFetch } from './dataFetch';
import { CartProps } from '../schema/shopProps';
import { cartCleaner, varietyFinder } from '../shopUtils';
import { getProduct } from './getProducts';

interface Coupon {
  __component: 'shop.coupon';
  percentage: number;
  leastAmount: number;
}
interface CouponShipping {
  __component: 'shop.coupon-shipping';
  percentage: number;
  leastAmount: number;
}
interface CouponPrice {
  __component: 'shop.coupon-price';
  discountPrice: number;
  leastAmount: number;
}

type KindProps = Coupon | CouponShipping | CouponPrice;

export const checkCoupon = async ({
  coupon,
  cart,
  price,
}: {
  coupon: string;
  cart: CartProps[];
  price: number;
}) => {
  const query = qs.stringify({
    filters: { couponCode: { $eq: coupon } },
    populate: '*',
  });

  const res = await dataFetch({ qs: `/coupons?${query}` });

  const result: {
    data: any;
    newCart: CartProps[];
    itemsPrice: number;
    shippingDiscount: number;
    error: string;
  } = {
    data: res,
    newCart: [],
    itemsPrice: 0,
    shippingDiscount: 100,
    error: '',
  };

  const kind = res?.data?.[0]?.kind?.[0] as KindProps | undefined;
  if (!kind) throw new Error('Invalid or missing coupon kind');

  const unique: CartProps[] = cartCleaner(cart);
  if (price < kind.leastAmount) {
    result.error = `مبلغ سفارش باید حداقل ${(
      kind.leastAmount / 10
    ).toLocaleString('fa-IR', {
      style: 'decimal',
      maximumFractionDigits: 0,
    })} تومان باشد`;
    return result;
  }
  if (kind.__component === 'shop.coupon' && price >= kind.leastAmount) {
    const newCart = await Promise.all(
      unique.map(async (item) => {
        const product = await getProduct({ slug: item.product.documentId });
        const mainPrice = Math.round(
          varietyFinder(item.variety, product.res[0]).mainPrice
        );

        let discountedPrice = mainPrice;

        discountedPrice = Math.round(
          mainPrice - mainPrice * (kind.percentage / 100)
        );
        result.itemsPrice = result.itemsPrice + discountedPrice * item.count;

        return {
          ...item,
          product: product.res[0],
          mainPrice: discountedPrice,
        };
      })
    );
    result.newCart = newCart;
  } else if (
    kind.__component === 'shop.coupon-price' &&
    price >= kind.leastAmount
  ) {
    await Promise.all(
      unique.map(async (item) => {
        const product = await getProduct({ slug: item.product.documentId });
        const mainPrice = Math.round(
          varietyFinder(item.variety, product.res[0]).mainPrice
        );

        result.itemsPrice = result.itemsPrice + mainPrice * item.count;
      })
    );
    result.itemsPrice = result.itemsPrice - kind.discountPrice;
  } else if (
    kind.__component === 'shop.coupon-shipping' &&
    price >= kind.leastAmount
  ) {
    result.shippingDiscount = kind.percentage;
  }

  return result;
};
