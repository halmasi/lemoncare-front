import { cartProductsProps, ProductProps } from './schema/shopProps';

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
      if (item.uniqueId == variety.id) {
        const subItem = item.subVariety.find(
          (sub) => sub.uniqueId == variety.sub
        );
        value = {
          specification:
            item.specification + ' | ' + subItem?.specification || '',
          color:
            subItem?.color == '#000000'
              ? item?.color == '#000000'
                ? ''
                : item?.color
              : subItem?.color || '',
          priceBefforDiscount: subItem?.priceBefforDiscount || 0,
          mainPrice: subItem?.mainPrice || 0,
          inventory: subItem?.inventory || 0,
          endOfDiscount: new Date(subItem?.endOfDiscount!).getTime() || null,
        };
      }
    });
    return value;
  } else {
    const item = product.variety.find((i) => i.uniqueId == variety.id);
    value = {
      color: item?.color == '#000000' ? '' : item?.color || '',
      inventory: item?.inventory || 0,
      mainPrice: item?.mainPrice || 0,
      priceBefforDiscount: item?.priceBeforeDiscount || 0,
      specification: item?.specification || '',
      endOfDiscount: new Date(item?.endOfDiscount!).getTime() || null,
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
      if (
        (item.mainPrice && item.mainPrice < lessPrice.price) ||
        !lessPrice.price
      ) {
        lessPrice.id = item.id;
        lessPrice.sub = null;
        lessPrice.uid = item.uniqueId;
        lessPrice.usub = null;
        lessPrice.price = item.mainPrice;
      }
    }
  });
  return lessPrice;
};
