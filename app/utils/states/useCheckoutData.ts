import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { AddressProps } from '@/app/utils/schema/userProps';

export interface checkoutStoreState {
  price: number;
  beforePrice: number;
  cartId: string;
  checkoutAddress: AddressProps | null;
  shippingOption: {
    courier_code: string;
    service_type: string;
    service_name: string;
  };
  shippingPrice: number;
  paymentOption: string;
  coupon: string | null;
  orderCode: number;
  orderHistoryCheckout: boolean;
  setOrderHistoryCheckout: (orderHistoryCheckout: boolean) => void;
  setPrice: (price: number) => void;
  setShippingPrice: (shippingPrice: number) => void;
  setBeforePrice: (beforePrice: number) => void;
  setCartId: (cartIt: string) => void;
  setCheckoutAddress: (getAddress: AddressProps | null) => void;
  setShippingOption: (option: {
    courier_code: string;
    service_type: string;
    service_name: string;
  }) => void;
  setPaymentOption: (option: string) => void;
  setCoupon: (coupon: string) => void;
  setOrderCode: (orderCode: number) => void;
  resetCheckout: () => void;
}

export const useCheckoutStore = create(
  persist<checkoutStoreState>(
    (set) => ({
      price: 0,
      beforePrice: 0,
      cartId: '',
      coupon: null,
      checkoutAddress: null,
      shippingPrice: 0,
      shippingOption: { courier_code: '', service_type: '', service_name: '' },
      paymentOption: '',
      orderCode: 0,
      orderHistoryCheckout: false,
      setOrderHistoryCheckout: (orderHistoryCheckout) =>
        set(() => ({ orderHistoryCheckout })),
      setPrice: (price) => set(() => ({ price })),
      setShippingPrice: (shippingPrice) => set(() => ({ shippingPrice })),
      setBeforePrice: (beforePrice) => set(() => ({ beforePrice })),
      setCartId: (id) => set(() => ({ cartId: id })),
      setCheckoutAddress: (getAddress: AddressProps | null) =>
        set(() => ({ checkoutAddress: getAddress })),
      setShippingOption: (option) => set(() => ({ shippingOption: option })),
      setPaymentOption: (option) => set(() => ({ paymentOption: option })),
      setCoupon: (coupon) => set(() => ({ coupon })),
      setOrderCode: (orderCode) => set(() => ({ orderCode })),
      resetCheckout: () => {
        set(() => ({
          price: 0,
          shippingPrice: 0,
          cartId: '',
          shippingOption: {
            courier_code: '',
            service_type: '',
            service_name: '',
          },
          paymentOption: '',
          checkoutAddress: null,
          coupon: null,
          orderCode: 0,
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
