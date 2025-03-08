import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { setCookie } from '../actions/actionMethods';
import { FetchUserProps } from '../schema/userProps';

export interface DataStoreState {
  jwt: string | null;
  user: FetchUserProps | null;
  setJwt: (jwt: string) => void;
  setUser: (user: FetchUserProps | null) => void;
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
        set(() => ({ jwt: null, user: null }));
        setCookie('jwt', 'null');
        localStorage.removeItem('user-store');
      },
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        console.log('Use useData State : ', state);
        if (!state || !state.jwt || !state.user) {
          return { jwt: null, user: null };
        }
        return state;
      },
    }
  )
);
