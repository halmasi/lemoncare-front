import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { cartProductsProps, CartProps } from '@/app/utils/schema/shopProps';

export interface cartStoreState {
  cart: CartProps[];
  cartProducts: cartProductsProps[];
  setCart: (cart: CartProps[]) => void;
  setCartProducts: (cartProducts: cartProductsProps[]) => void;
  resetCart: () => void;
}

export const useCartStore = create(
  persist<cartStoreState>(
    (set) => ({
      cart: [],
      cartProducts: [],
      setCart: (cartData) => set(() => ({ cart: cartData })),
      setCartProducts: (cartProducts) => set(() => ({ cartProducts })),
      resetCart: () => {
        set(() => ({ cart: [], cartProducts: [] }));
        localStorage.removeItem('cart-store');
      },
    }),
    {
      name: 'cart-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
