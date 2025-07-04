import { requestData } from '../data/dataFetch';
import { CartProps } from '@/app/utils/schema/shopProps';
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

  const response = await requestData({
    qs: `/carts/${documentId}?${query}`,
    method: 'GET',
    token: check.jwt,
  });
  return response.data;
};

export const updateCartOnLogin = async (
  newCart: {
    count: number;
    product: string;
    variety: { id: number; sub: number | null };
  }[],
  id: string
) => {
  const check = await loginCheck();
  const response = await requestData({
    qs: `/carts/${id}`,
    method: 'PUT',
    body: {
      data: {
        items: newCart.map((item) => ({
          count: item.count,
          product: item.product,
          variety: item.variety,
        })),
      },
    },
    token: check.jwt,
  });
  const data: UpdateCartResultProps = response.data;
  return data;
};

export const updateCart = async (cart: CartProps[], id: string) => {
  const check = await loginCheck();
  const response = await requestData({
    qs: `/carts/${id}`,
    method: 'PUT',
    body: {
      data: {
        items: cart.map((item) => ({
          count: item.count,
          product: item.product.documentId,
          variety: item.variety,
        })),
      },
    },
    token: check.jwt,
  });
  const data: UpdateCartResultProps = response.data;
  return data;
};

export const emptyCart = async (id: string) => {
  const check = await loginCheck();
  const response = await requestData({
    qs: `/carts/${id}`,
    method: 'PUT',
    body: {
      data: {
        items: [],
      },
    },
    token: check.jwt,
  });
  const data: UpdateCartResultProps = response.data;
  return data;
};

export const addToCart = async (
  cart: CartProps[],
  newItem: {
    count: number;
    id: string;
    variety: { id: number; sub: number | null };
  },
  id: string
) => {
  const newCart: {
    count: number;
    product: string;
    variety: { id: number; sub: number | null };
  }[] = cart.map((item) => ({
    count: item.count,
    product: item.product.documentId,
    variety: item.variety,
  }));
  newCart.push({
    count: newItem.count,
    product: newItem.id,
    variety: newItem.variety,
  });
  const check = await loginCheck();
  const response = await requestData({
    qs: `/carts/${id}`,
    method: 'PUT',
    body: {
      data: {
        items: newCart,
      },
    },
    token: check.jwt,
  });

  const data = response.data;
  return data;
};
