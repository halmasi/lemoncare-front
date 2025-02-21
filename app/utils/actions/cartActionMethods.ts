import { requestData } from '../data/dataFetch';
import { CartProps } from '../schema/shopProps/cartProps';
import { loginCheck } from './actionMethods';
import qs from 'qs';

interface UpdateCartResultProps {
  data: {
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export const getCart = async (documentId: string) => {
  const check = await loginCheck();

  const query = qs.stringify({
    populate: {
      items: { populate: '*' },
    },
  });

  const response = await requestData(
    `/carts/${documentId}?${query}`,
    'GET',
    {},
    check.jwt
  );
  return response.data;
};

export const updateCartOnLogin = async (
  newCart: {
    count: number;
    product: { documentId: string };
    variety: { id: number; sub: number | null };
  }[],
  id: string
) => {
  const check = await loginCheck();
  const response = await requestData(
    `/carts/${id}`,
    'PUT',
    {
      data: {
        items: newCart,
      },
    },
    check.jwt
  );
  console.log('from update func: ', newCart);
  console.log('from update func(result): ', response.data);
  const data: UpdateCartResultProps = response.data;
  return data;
};

export const updateCart = async (cart: CartProps[], id?: string) => {
  const check = await loginCheck();
  const response = await requestData(
    `/users/${id || check.body.id}`,
    'PUT',
    {
      cart,
    },
    check.jwt
  );
  const data: UpdateCartResultProps = response.data;
  return data;
};

export const addToCart = async (
  cart: CartProps[],
  newItem: {
    count: number;
    id: string;
    variety: { id: number; sub: number | null };
  }
) => {
  const newCart: object[] = cart;
  newCart.push({
    count: newItem.count,
    product: { documentId: newItem.id },
    variety: newItem.variety,
  });
  const check = await loginCheck();
  const response = await requestData(
    `/carts/${check.body.id}`,
    'PUT',
    {
      cart: newCart,
    },
    check.jwt
  );

  const data = response.data;
  return data;
};
