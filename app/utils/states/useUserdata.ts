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
  cart?: { id: number; count: number; product: ProductProps }[];
}

export interface DataStoreState {
  jwt: string | null;
  user: UserProps | null;
  setJwt: (jwt: string) => void;
  setUser: (user: UserProps) => void;
  resetUser: () => void;
}

export const useDataStore = create(
  persist<DataStoreState>(
    (set) => ({
      jwt: null,
      user: null,
      setJwt: (jwt) => set(() => ({ jwt })),
      setUser: (user) => set(() => ({ user })),
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
