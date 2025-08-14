import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { CartProps } from '@/app/utils/schema/shopProps';

export interface cartStoreState {
  cart: CartProps[];
  setCart: (cart: CartProps[]) => void;
  resetCart: () => void;
}

export const useCartStore = create(
  persist<cartStoreState>(
    (set) => ({
      cart: [],
      setCart: (cartData) => set(() => ({ cart: cartData })),
      resetCart: () => {
        set(() => ({ cart: [] }));
        localStorage.removeItem('cart-store');
      },
    }),
    {
      name: 'cart-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
