import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface checkoutStoreState {
  price: number;
  cartId: string;
  shippingOption: string;
  paymentOption: string;
  setPrice: (price: number) => void;
  setCartId: (cartIt: string) => void;
  setShippingOption: (option: string) => void;
  setPaymentOption: (option: string) => void;
  resetCheckout: () => void;
}

export const useCheckoutStore = create(
  persist<checkoutStoreState>(
    (set) => ({
      price: 0,
      cartId: '',
      shippingOption: '',
      paymentOption: '',
      setPrice: (price) => set(() => ({ price })),
      setCartId: (id) => set(() => ({ cartId: id })),
      setShippingOption: (option) => set(() => ({ shippingOption: option })),
      setPaymentOption: (option) => set(() => ({ paymentOption: option })),
      resetCheckout: () => {
        set(() => ({
          price: 0,
          cartId: '',
          shippingOption: '',
          paymentOption: '',
        }));
        localStorage.removeItem('checkout-store');
      },
    }),
    {
      name: 'checkout-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
