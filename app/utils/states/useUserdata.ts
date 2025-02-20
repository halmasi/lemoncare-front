import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { setCookie } from '../actions/actionMethods';
import { CartProps } from './useCartData';
import { ProductProps } from '../data/getProducts';

export interface UserProps {
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

export interface DataStoreState {
  jwt: string | null;
  user: UserProps | null;
  setJwt: (jwt: string) => void;
  setUser: (user: UserProps | null) => void;
  resetUser: () => void;
}

export const useDataStore = create(
  persist<DataStoreState>(
    (set) => ({
      jwt: null,
      user: null,
      setJwt: (jwt) => set(() => ({ jwt })),
      setUser: (user) =>
        set(() => ({ user: user ? JSON.parse(JSON.stringify(user)) : null })),
      resetUser: () => {
        set(() => ({ cart: [], cartProducts: [], jwt: null, user: null }));
        setCookie('jwt', 'null');
        localStorage.removeItem('user-store');
      },
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => localStorage),
      // onRehydrateStorage: () => (state) => {
      // console.log('Use useData State : ', state);
      // if (!state || !state.jwt || !state.user) {
      // return { jwt: null, user: null };
      // }
      // return state;
      // },
    }
  )
);
