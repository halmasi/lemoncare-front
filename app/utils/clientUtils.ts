import { getProduct } from './data/getProducts';
import { cartProductsProps } from './schema/shopProps';

export const CartProductSetter = async (
  documentId: string,
  cartProducts: cartProductsProps[]
) => {
  const newArray = cartProducts;

  const findProduct = cartProducts.find(
    (item) => item.documentId == documentId
  );

  if (!findProduct) {
    const product = await getProduct(documentId);
    newArray.push({
      basicInfo: product[0].basicInfo,
      documentId: product[0].documentId,
      variety: product[0].variety,
    });
  }

  return newArray;
};
