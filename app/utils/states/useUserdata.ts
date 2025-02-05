import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { setCookie } from '../actions/actionMethods';
import { ImageProps } from '@/app/utils/data/getPosts';

export interface UserProps {
  id?: string;
  fullName?: string;
  email?: string;
  username?: string;
  data?: object | string | object[] | string[];
  cart: CartProps[];
}
export interface CartProps {
  id: number;
  count: number;
  product: cartProductsProps;
  variety: { id: number; sub: number | null };
}
export interface cartProductsProps {
  documentId: string;
  variety: {
    id: number;
    specification: string;
    priceBeforeDiscount: number;
    mainPrice: number;
    endOfDiscount: string;
    color: string;
    inventory: number;
    uniqueId: number;
    subVariety:
      | {
          id: number;
          specification: string;
          priceBefforDiscount: number;
          mainPrice: number;
          endOfDiscount: string;
          color: string;
          inventory: number;
          uniqueId: number;
        }[]
      | [];
  }[];
  basicInfo: {
    id: number;
    title: string;
    mainImage: ImageProps;
    contentCode: number;
  };
}

export interface DataStoreState {
  jwt: string | null;
  user: UserProps | null;
  cart: CartProps[];
  cartProducts: cartProductsProps[];
  setJwt: (jwt: string) => void;
  setCart: (cart: CartProps[]) => void;
  setCartProducts: (cartProducts: cartProductsProps[]) => void;
  setUser: (user: UserProps) => void;
  resetUser: () => void;
  resetCart: () => void;
}

export const useDataStore = create(
  persist<DataStoreState>(
    (set) => ({
      jwt: null,
      cart: [],
      cartProducts: [],
      user: null,
      setJwt: (jwt) => set(() => ({ jwt })),
      setUser: (user) => set(() => ({ user })),
      setCart: (cart) => set(() => ({ cart })),
      setCartProducts: (cartProducts) => set(() => ({ cartProducts })),
      resetUser: () => {
        set(() => ({ cart: [], cartProducts: [], jwt: null, user: null }));
        setCookie('jwt', 'null');
        localStorage.removeItem('user-store');
      },
      resetCart: () => {
        set(() => ({ cart: [], cartProducts: [] }));
        localStorage.removeItem('user-store');
      },
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => localStorage),
      // onRehydrateStorage: () => (state) => {
      // if (!state || !state.jwt || !state.user) {
      // return { jwt: null, user: null };
      // }
      // return state;
      // },
    }
  )
);
