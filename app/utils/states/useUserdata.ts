import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { FetchUserProps } from '@/app/utils/schema/userProps';

export interface DataStoreState {
  loginProcces: boolean;
  jwt: string | null;
  user: FetchUserProps | null;
  setJwt: (jwt: string) => void;
  setLoginProcces: (isLogin: boolean) => void;
  setUser: (user: FetchUserProps | null) => void;
  resetUser: () => void;
}

export const useDataStore = create(
  persist<DataStoreState>(
    (set) => ({
      loginProcces: false,
      jwt: null,
      user: null,
      setJwt: (jwt) => set(() => ({ jwt })),
      setLoginProcces: (isLogin) => set(() => ({ loginProcces: isLogin })),
      setUser: (user) =>
        set(() => ({ user: user ? JSON.parse(JSON.stringify(user)) : null })),
      resetUser: () => {
        set(() => ({ jwt: null, user: null, loginProcces: false }));
        localStorage.removeItem('user-store');
      },
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (!state || !state.jwt || !state.user) {
          return { jwt: null, user: null };
        }
        return state;
      },
    }
  )
);
