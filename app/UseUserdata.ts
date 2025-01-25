import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface UserProps {
  id?: string;
  fullName?: string;
  email?: string;
  username?: string;
  data?: object | string | object[] | string[];
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
        localStorage.removeItem('user-store');
      },
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
