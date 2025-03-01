import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { AddressProps } from '../schema/userProps';

export interface checkoutStoreState {
  price: number;
  cartId: string;
  checkoutAddress: AddressProps | null;
  shippingOption: string;
  paymentOption: string;
  setPrice: (price: number) => void;
  setCartId: (cartIt: string) => void;
  setCheckoutAddress: (getAddress: AddressProps) => void;
  setShippingOption: (option: string) => void;
  setPaymentOption: (option: string) => void;
  resetCheckout: () => void;
}

export const useCheckoutStore = create(
  persist<checkoutStoreState>(
    (set) => ({
      price: 0,
      cartId: '',
      checkoutAddress: null,
      shippingOption: '',
      paymentOption: '',
      setPrice: (price) => set(() => ({ price })),
      setCartId: (id) => set(() => ({ cartId: id })),
      setCheckoutAddress: (getAddress: AddressProps) =>
        set(() => ({ checkoutAddress: getAddress })),
      setShippingOption: (option) => set(() => ({ shippingOption: option })),
      setPaymentOption: (option) => set(() => ({ paymentOption: option })),
      resetCheckout: () => {
        set(() => ({
          price: 0,
          cartId: '',
          shippingOption: '',
          paymentOption: '',
          checkoutAddress: null,
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
