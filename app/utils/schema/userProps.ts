import { CartProps } from '../states/useCartData';
import { ProductProps } from './shopProps/productProps';

export interface UserProps {
  username: string;
  email: string;
  phoneNumber: number;
  password: string;
}
export interface ErrorProps {
  status: number;
  name: string;
  message: string;
  details: object;
}
export interface LoginUserProps {
  data: {
    user: {
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
    };
    jwt: string;
    error?: string;
  };
}
export interface SignInState {
  success: boolean;
  fieldErrors?: {
    email?: string[];
    password?: string[];
    server?: string[];
  };
  jwt?: string;
  user?: string;
}

export interface FetchUserProps {
  id?: string;
  fullName?: string;
  email?: string;
  username?: string;
  data?: object | string | object[] | string[];
  cart: CartProps[];
}

export interface OrderHistoryProps {
  id: number;
  orderDate: string;
  pay: object | null;
  address: string;
  postCode: number;
  items: {
    id: number;
    count: number;
    variety: { id: number; sub: number | null };
    product: ProductProps;
  }[];
}

interface postalInformationProps {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  information: {
    id: number;
    address: string;
    postCode: number;
    firstName: string;
    lastName: string;
    province: string;
    city: string;
    phoneNumber: number;
    mobileNumber: number;
    isDefault: boolean;
  }[];
}
