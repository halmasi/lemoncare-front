import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { AddressProps } from '../schema/userProps';

export interface checkoutStoreState {
  price: number;
  beforePrice: number;
  cartId: string;
  checkoutAddress: AddressProps | null;
  shippingOption: { courier_code: string; service_type: string };
  shippingPrice: number;
  paymentOption: string;
  setPrice: (price: number) => void;
  setShippingPrice: (shippingPrice: number) => void;
  setBeforePrice: (beforePrice: number) => void;
  setCartId: (cartIt: string) => void;
  setCheckoutAddress: (getAddress: AddressProps) => void;
  setShippingOption: (option: {
    courier_code: string;
    service_type: string;
  }) => void;
  setPaymentOption: (option: string) => void;
  resetCheckout: () => void;
}

export const useCheckoutStore = create(
  persist<checkoutStoreState>(
    (set) => ({
      price: 0,
      beforePrice: 0,
      cartId: '',
      checkoutAddress: null,
      shippingPrice: 0,
      shippingOption: { courier_code: '', service_type: '' },
      paymentOption: '',
      setPrice: (price) => set(() => ({ price })),
      setShippingPrice: (shippingPrice) => set(() => ({ shippingPrice })),
      setBeforePrice: (beforePrice) => set(() => ({ beforePrice })),
      setCartId: (id) => set(() => ({ cartId: id })),
      setCheckoutAddress: (getAddress: AddressProps) =>
        set(() => ({ checkoutAddress: getAddress })),
      setShippingOption: (option) => set(() => ({ shippingOption: option })),
      setPaymentOption: (option) => set(() => ({ paymentOption: option })),
      resetCheckout: () => {
        set(() => ({
          price: 0,
          shippingPrice: 0,
          cartId: '',
          shippingOption: { courier_code: '', service_type: '' },
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
