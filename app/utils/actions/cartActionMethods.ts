import { CommentProps } from 'postcss';
import { requestData } from '../data/dataFetch';
import { CartProps } from '../states/useCartData';
import { loginCheck } from './actionMethods';
import { getProduct, ProductProps } from '../data/getProducts';

interface UpdateCartResultProps {
  id: number;
  documentId: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  username: string;
  fullName: string;
  role: {
    id: number;
    documentId: string;
    name: string;
    description: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  cart: CartProps[];
  orderHistory: object[];
  postalInformation: object[];
  comments: CommentProps[];
  favorites: object[];
  createdBy: {
    id: number;
    documentId: string;
    firstname: string;
    lastname: string;
    username: string | null;
    email: string;
    isActive: boolean;
    blocked: boolean;
    preferedLanguage: string | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  updatedBy: {
    id: number;
    documentId: string;
    firstname: string;
    lastname: string;
    username: string | null;
    email: string;
    isActive: boolean;
    blocked: boolean;
    preferedLanguage: string | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  localizations: object[];
}

export const updateCartOnLogin = async (
  newCart: {
    count: number;
    product: { documentId: string };
    variety: { id: number; sub: number | null };
  }[]
) => {
  const check = await loginCheck();
  const response = await requestData(
    `/users/${check.body.id}`,
    'PUT',
    {
      cart: newCart,
    },
    check.jwt
  );
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
    `/users/${check.body.id}`,
    'PUT',
    {
      cart: newCart,
    },
    check.jwt
  );

  const data: UpdateCartResultProps = response.data;
  return data;
};
