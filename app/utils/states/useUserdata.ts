import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { setCookie } from '../actions/actionMethods';
import { ProductProps } from '../data/getProducts';

export interface UserProps {
  id?: string;
  fullName?: string;
  email?: string;
  username?: string;
  data?: object | string | object[] | string[];
  cart?: CartProps[];
}
export interface CartProps {
  id: number;
  count: number;
  product: ProductProps;
  variety: { id: number; sub: number | null };
}
export interface DataStoreState {
  jwt: string | null;
  user: UserProps | null;
  cart: CartProps[];
  setJwt: (jwt: string) => void;
  setCart: (cart: CartProps[]) => void;
  setUser: (user: UserProps) => void;
  resetUser: () => void;
}

export const useDataStore = create(
  persist<DataStoreState>(
    (set) => ({
      jwt: null,
      cart: [],
      user: null,
      setJwt: (jwt) => set(() => ({ jwt })),
      setUser: (user) => set(() => ({ user })),
      setCart: (cart) => set(() => ({ cart })),
      resetUser: () => {
        set(() => ({ jwt: null, user: null }));
        setCookie('jwt', 'null');
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
