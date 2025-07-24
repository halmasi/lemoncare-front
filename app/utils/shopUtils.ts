import { cartProductsProps, ProductProps } from './schema/shopProps';
import { getProduct } from './data/getProducts';
import qs from 'qs';
import { dataFetch } from './data/dataFetch';

export const varietyFinder = (
  variety: { id: number; sub: number | null },
  product: ProductProps | cartProductsProps
) => {
  let value: {
    specification: string;
    color: string;
    priceBefforDiscount: number;
    mainPrice: number;
    inventory: number;
    endOfDiscount: number | null;
  } = {
    specification: '',
    color: '',
    priceBefforDiscount: 0,
    mainPrice: 0,
    inventory: 0,
    endOfDiscount: 0,
  };
  if (variety.sub) {
    product.variety.forEach((item) => {
      if (item.uniqueId == variety.id && item) {
        const subItem = item.subVariety.find(
          (sub) => sub.uniqueId == variety.sub
        );
        if (subItem)
          value = {
            specification:
              item.specification + ' | ' + subItem?.specification || '',
            color:
              subItem?.color == '#000000'
                ? item.color == '#000000'
                  ? ''
                  : item.color
                : subItem?.color || '',
            priceBefforDiscount: subItem?.priceBefforDiscount || 0,
            mainPrice: subItem?.mainPrice || 0,
            inventory: subItem?.inventory || 0,
            endOfDiscount:
              subItem && subItem.endOfDiscount
                ? new Date(subItem.endOfDiscount).getTime()
                : 0,
          };
      }
    });
  } else {
    const item = product.variety.find((i) => i.uniqueId == variety.id);
    if (item)
      value = {
        color: item.color == '#000000' ? '' : item.color || '',
        inventory: item.inventory || 0,
        mainPrice: item.mainPrice || 0,
        priceBefforDiscount: item.priceBeforeDiscount || 0,
        specification: item.specification || '',
        endOfDiscount:
          item && item.endOfDiscount
            ? new Date(item.endOfDiscount).getTime()
            : 0,
      };
  }
  return value;
};

export const lowestPrice = (product: ProductProps | cartProductsProps) => {
  const lessPrice: {
    id: number | null;
    sub: number | null;
    uid: number;
    usub: number | null;
    price: number;
  } = { id: null, sub: null, uid: 0, usub: null, price: 0 };

  product.variety.map((item) => {
    console.log(item);
    if (item.subVariety.length) {
      item.subVariety.map((sub) => {
        if (sub.mainPrice < lessPrice.price || !lessPrice.price) {
          lessPrice.id = item.id;
          lessPrice.sub = sub.id;
          lessPrice.uid = item.uniqueId;
          lessPrice.usub = sub.uniqueId;
          lessPrice.price = sub.mainPrice;
        }
      });
    } else if (item.mainPrice < lessPrice.price || !lessPrice.price) {
      lessPrice.id = item.id;
      lessPrice.sub = null;
      lessPrice.uid = item.uniqueId;
      lessPrice.usub = null;
      lessPrice.price = item.mainPrice;
    }
  });
  return lessPrice;
};

export const cartProductSetter = async (
  documentId: string,
  cartProducts: cartProductsProps[]
) => {
  const newArray = cartProducts;

  const findProduct = cartProducts.find(
    (item) => item.documentId == documentId
  );

  if (!findProduct) {
    const getData = await getProduct(documentId);
    const product = getData.res;
    newArray.push({
      basicInfo: product[0].basicInfo,
      documentId: product[0].documentId,
      variety: product[0].variety,
    });
  }

  return newArray;
};

export const cartProductSelector = async (
  documentId: string,
  cartProducts: cartProductsProps[]
) => {
  const findProduct = cartProducts.find(
    (item) => item.documentId == documentId
  );

  if (!findProduct) {
    const product = await getProduct(documentId);
    return product.res[0];
  }
  return findProduct;
};

export const orderHistoryIdMaker = async (): Promise<number> => {
  const orderId: number = parseInt((Math.random() * 10000000000).toFixed(0));
  const queryPost = qs.stringify({
    filters: {
      order: {
        orderCode: { $eq: orderId },
      },
    },
    populate: {
      order: {
        populate: {
          items: {
            populate: {
              product: { populate: { basicInfo: { populate: ['mainImage'] } } },
            },
          },
        },
      },
    },
  });
  const res = await dataFetch({ qs: `/order-histories?${queryPost}` });
  if (res.data.length) await orderHistoryIdMaker();
  return orderId;
};
