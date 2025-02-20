import { ImageProps } from 'next/image';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

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
