import { PostsProps } from './blogProps';
import { CartProps, ProductProps } from './shopProps';

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

export interface AddressProps {
  id: number;
  address: string;
  postCode: number;
  firstName: string;
  lastName: string;
  province: string;
  provinceCode?: number;
  city: string;
  cityCode?: number;
  phoneNumber: number | string | null;
  mobileNumber: number | string;
  isDefault: boolean;
}

export interface FetchUserProps {
  id?: string;
  documentId?: string;
  fullName?: string;
  email?: string;
  username?: string;
  data?: object | string | object[] | string[];
  cart: CartProps[];
  shopingCart: {
    documentId: string;
    items: CartProps[];
  };
  postal_information: {
    documentId: string;
    id: number;
    information: AddressProps[];
  };
  order_history: {
    documentId: string;
    id: number;
  };
  favorites: {
    documentId: string;
    id: number;
    posts: PostsProps[];
    products: ProductProps[];
  }[];
}

export interface OrderHistoryProps {
  id: number;
  orderDate: string;
  pay: boolean;
  address: string;
  postCode: number;
  items: {
    id: number;
    count: number;
    variety: { id: number; sub: number | null };
    product: ProductProps;
  }[];
}
