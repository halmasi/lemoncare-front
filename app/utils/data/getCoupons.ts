import qs from 'qs';
import { dataFetch } from './dataFetch';
import {
  CartProps,
  ProductProps,
  ShopCategoryProps,
} from '../schema/shopProps';
import { cartCleaner, varietyFinder } from '../shopUtils';
import {
  getProduct,
  getProductsByCategory,
  getProductsByTag,
} from './getProducts';
import { CategoriesProps, TagsProps } from '../schema/blogProps';
import { FetchUserProps } from '../schema/userProps';
import { loginCheck } from '../actions/actionMethods';
import {
  getCategoryparentHierarchy,
  getCategorySubHierarchy,
  getShopCategories,
  getShopCategory,
} from './getProductCategories';

interface CouponPercentage {
  __component: 'shop.coupon';
  percentage: number;
  leastAmount: number;
  limit: number;
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

type KindProps = CouponPercentage | CouponShipping | CouponPrice;

const checkProducts = async ({
  products,
  shopCategory,
  shopTags,
  itemDocumentId,
}: {
  products?: ProductProps[];
  shopCategory?: ShopCategoryProps[];
  shopTags?: TagsProps[];
  itemDocumentId: string;
}) => {
  let res = false;
  const product = await getProduct({ slug: itemDocumentId });
  if (res == false && products && products.length) {
    const isContain = products.some((i) => i.documentId === itemDocumentId);
    if (isContain) {
      res = true;
    }
  }
  if (res == false && shopCategory) {
    const categories = await Promise.all(
      shopCategory.map(async (item) => {
        const get = await getShopCategory(item.slug);
        const categoriesTree = await getCategorySubHierarchy(get);
        return [...categoriesTree];
      })
    );
    categories.forEach((item) => {
      const find = item.some((i) => i.slug == product.res[0].category.slug);
      if (find) {
        res = true;
      }
    });
  }
  if (res == false && shopTags) {
    await Promise.all(
      shopTags.map(async (item) => {
        const products = await getProductsByTag({
          slug: item.slug,
          productDocumentId: itemDocumentId,
        });
        if (products.res[0]) res = true;
      })
    );
    // if (tags[0].res.length) res = true;
  }
  return res;
};

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
    data: {
      id: number;
      documentId: string;
      couponCode: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      endOfDiscount: Date | null;
      kind: KindProps[];
      products: ProductProps[];
      shop_categories: ShopCategoryProps[];
      shop_tags: TagsProps[];
      user: FetchUserProps[];
    };
    itemsPrice: number;
    itemsPriceBefore: number;
    itemsDiscountPrice: number;
    shippingDiscount: number;
    error: string;
  } = {
    data: res.data[0],
    itemsPrice: 0,
    itemsPriceBefore: 0,
    itemsDiscountPrice: 0,
    shippingDiscount: 100,
    error: '',
  };

  const check = await loginCheck();
  if (
    result.data.user &&
    Array.isArray(result.data.user) &&
    result.data.user.length
  ) {
    const findUser = result.data.user.find(
      (u) => u.username == check.body.username
    );
    if (!findUser) {
      result.error = 'کد تخفیف مختص کاربر دیگری است.';
      return result;
    }
  }

  const kind = result.data.kind?.[0] as KindProps;
  if (!kind) {
    result.error = 'خطا در دریافت کد تخفیف';
    return result;
  }

  if (price < kind.leastAmount) {
    result.error = `مبلغ سفارش باید حداقل ${(
      kind.leastAmount / 10
    ).toLocaleString('fa-IR', {
      style: 'decimal',
      maximumFractionDigits: 0,
    })} تومان باشد`;
    return result;
  }

  const unique: CartProps[] = cartCleaner(cart);
  const productsList: ProductProps[] = [];
  if (
    result.data.products &&
    Array.isArray(result.data.products) &&
    result.data.products.length
  ) {
    result.data.products.forEach((item) => {
      productsList.push(item);
    });
  }

  if (kind.__component === 'shop.coupon' && price >= kind.leastAmount) {
    await Promise.all(
      unique.map(async (item) => {
        const product = await getProduct({ slug: item.product.documentId });
        const mainPrice = varietyFinder(item.variety, product.res[0]).mainPrice;
        if (
          (productsList &&
            Array.isArray(productsList) &&
            productsList.length) ||
          (result.data.shop_categories &&
            Array.isArray(result.data.shop_categories) &&
            result.data.shop_categories.length) ||
          (result.data.shop_tags &&
            Array.isArray(result.data.shop_tags) &&
            result.data.shop_tags.length)
        ) {
          const isContain = await checkProducts({
            itemDocumentId: item.product.documentId,
            products: productsList,
            shopCategory: result.data.shop_categories,
            shopTags: result.data.shop_tags,
          });

          if (isContain) {
            const discountPrice = mainPrice * (kind.percentage / 100);
            result.itemsDiscountPrice =
              result.itemsDiscountPrice + discountPrice * item.count;
            result.itemsPrice = result.itemsPrice + mainPrice * item.count;
            if (kind.limit > 0 && result.itemsDiscountPrice > kind.limit) {
              result.itemsDiscountPrice = kind.limit;
            }
          }
        } else {
          const discountPrice = mainPrice * (kind.percentage / 100);

          result.itemsDiscountPrice =
            result.itemsDiscountPrice + discountPrice * item.count;
          result.itemsPrice = result.itemsPrice + mainPrice * item.count;

          if (kind.limit > 0 && result.itemsDiscountPrice > kind.limit) {
            result.itemsDiscountPrice = kind.limit;
          }
        }
      })
    );
    // if (result.itemsPrice < kind.leastAmount) {
    //   result.error = 'میزان خرید شما به حد کافی نمیباشد';
    //   return result;
    // }
  } else if (
    kind.__component === 'shop.coupon-price' &&
    price >= kind.leastAmount
  ) {
    let prices = 0;
    await Promise.all(
      unique.map(async (item) => {
        const product = await getProduct({ slug: item.product.documentId });
        const mainPrice = varietyFinder(item.variety, product.res[0]).mainPrice;
        if (
          (productsList &&
            Array.isArray(productsList) &&
            productsList.length) ||
          (result.data.shop_categories &&
            Array.isArray(result.data.shop_categories) &&
            result.data.shop_categories.length) ||
          (result.data.shop_tags &&
            Array.isArray(result.data.shop_tags) &&
            result.data.shop_tags.length)
        ) {
          const isContain = await checkProducts({
            itemDocumentId: item.product.documentId,
            products: productsList,
            shopCategory: result.data.shop_categories,
            shopTags: result.data.shop_tags,
          });
          if (isContain) {
            prices += mainPrice * item.count;
            result.itemsDiscountPrice = kind.discountPrice;
          }
        } else {
          prices += mainPrice * item.count;
          result.itemsDiscountPrice = kind.discountPrice;
        }
        if (prices < kind.leastAmount) {
          result.error = 'میزان مبلغ کالاهای شامل تخفیف کمتر از حداقل است.';
          return result;
        }
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
