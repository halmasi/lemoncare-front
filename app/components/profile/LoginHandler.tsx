'use client';

import {
  getFullUserData,
  logoutAction,
  setCookie,
} from '@/app/utils/actions/actionMethods';
import {
  getCart,
  updateCartOnLogin,
} from '@/app/utils/actions/cartActionMethods';
import {
  getPostalInformation,
  updatePostalInformation,
  updateUserInformation,
} from '@/app/utils/data/getUserInfo';
import { CartProps } from '@/app/utils/schema/shopProps/cartProps';
import { useCartStore } from '@/app/utils/states/useCartData';
import { useCheckoutStore } from '@/app/utils/states/useCheckoutData';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginHandler() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setUser, jwt, user, loginProcces, setLoginProcces } = useDataStore();
  const { cart, setCart } = useCartStore();
  const { checkoutAddress } = useCheckoutStore();

  const handleCart = (fetchedCart: CartProps[], id: string) => {
    if (fetchedCart && cart) {
      const cartItems: CartProps[] = [...fetchedCart, ...cart];
      cartItems.forEach((item) => {
        let dup = 0;
        cartItems.forEach((check) => {
          if (
            item.product.documentId == check.product.documentId &&
            item.variety.id == check.variety.id &&
            item.variety.sub == check.variety.sub
          ) {
            dup++;
            if (dup > 1) {
              cartItems.splice(cartItems.indexOf(item), 1);
            }
          }
        });
      });
      updateCartFn.mutate({ newCart: cartItems, id });
    } else if (fetchedCart && !cart) setCart(fetchedCart);
    else if (!fetchedCart && cart) updateCartFn.mutate({ newCart: cart, id });
  };

  const getCartFn = useMutation({
    mutationFn: async (documentId: string) => {
      const res = await getCart(documentId);
      return { result: res, documentId };
    },
    onSuccess: (data) => {
      handleCart(data.result.data.items, data.documentId);
    },
  });

  const updateCartFn = useMutation({
    mutationFn: async ({
      newCart,
      id,
    }: {
      newCart: CartProps[];
      id: string;
    }) => {
      const updateCart = newCart.map((item) => {
        return {
          count: item.count,
          product: item.product.documentId,
          variety: item.variety,
        };
      });
      await updateCartOnLogin(updateCart, id);
      const res = await getCart(id);
      return res.data;
    },
    onSuccess: async (data) => {
      if (!data) return;
      setCart(data.items);
    },
    onError: (error: { message: string[] }) => {
      throw new Error('خطا : ' + error.message);
    },
  });

  useEffect(() => {
    const loginFn = async () => {
      await setCookie('jwt', `Bearer ${jwt}`);
      const userData = await getFullUserData();
      if (
        !userData.body.fullName &&
        checkoutAddress &&
        checkoutAddress.firstName &&
        checkoutAddress.lastName
      ) {
        userData.body.fullName =
          checkoutAddress.firstName + ' ' + checkoutAddress.lastName;
        await updateUserInformation(userData.body.id, `Bearer ${jwt}`, {
          fullName: userData.body.fullName,
        });
      }
      setUser(userData.body);
      queryClient.setQueryData(['user'], userData.body);
      if (userData.body.postal_information) {
        const userPostalInformation = await getPostalInformation(
          userData.body.postal_information.documentId
        );
        if (checkoutAddress?.address && !userPostalInformation.lenght) {
          await updatePostalInformation(
            [
              {
                address: checkoutAddress.address,
                province: checkoutAddress.province,
                city: checkoutAddress.city,
                firstName: checkoutAddress.firstName,
                lastName: checkoutAddress.lastName,
                mobileNumber: checkoutAddress.mobileNumber,
                phoneNumber: checkoutAddress.phoneNumber,
                postCode: checkoutAddress.postCode,
                id: 0,
                isDefault: true,
              },
            ],
            userData.body.postal_information.documentId
          );
        }
      }
      if (userData.body.shopingCart) {
        getCartFn.mutate(userData.body.shopingCart.documentId);
      }
      setLoginProcces(false);
      router.refresh();
    };
    if (!user && loginProcces) loginFn();
  }, [loginProcces, user, jwt, router]);

  return <></>;
}
