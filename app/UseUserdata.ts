import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type User = {
  id?: string;
  email?: string;
  username?: string;
  data?: object | string | object[] | string[];
} | null;

type DataStoreState = {
  jwt: string | null;
  user: User;
  setJwt: (jwt: string | null) => void;
  setUser: (user: User) => void;
  resetUser: () => void;
};

export const useDataStore = create(
  persist<DataStoreState>(
    (set) => ({
      jwt: null,
      user: null,
      setJwt: (jwt) => set(() => ({ jwt })),
      setUser: (user) => set(() => ({ user })),
      resetUser: () => set(() => ({ jwt: null, user: null })),
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
