'use client';

import {
  getCookie,
  getFullUserData,
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
import { CartProps } from '@/app/utils/schema/shopProps';
import { useCartStore } from '@/app/utils/states/useCartData';
import { useCheckoutStore } from '@/app/utils/states/useCheckoutData';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginHandler() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const {
    setUser,
    jwt,
    setJwt,
    user,
    loginProcces,
    setLoginProcces,
    resetUser,
  } = useDataStore();
  const { cart, setCart, resetCart } = useCartStore();
  const { checkoutAddress } = useCheckoutStore();

  const handleCart = (fetchedCart: CartProps[], id: string) => {
    if (fetchedCart && cart) {
      // Use a Map to deduplicate items
      const cartMap = new Map<string, CartProps>();
      [...fetchedCart, ...cart].forEach((item) => {
        const key = `${item.product.documentId}-${item.variety.id}-${item.variety.sub}`;
        cartMap.set(key, item);
      });
      const deduplicatedCart = Array.from(cartMap.values());
      updateCartFn.mutateAsync({ newCart: deduplicatedCart, id });
    } else if (fetchedCart && !cart) {
      setCart(fetchedCart);
    } else if (!fetchedCart && cart) {
      updateCartFn.mutateAsync({ newCart: cart, id });
    }
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
      try {
        setLoginProcces(true);

        // Set JWT cookie
        await setCookie('jwt', `Bearer ${jwt}`);

        // Fetch user data and cart in parallel
        const [userData, cartData] = await Promise.all([
          getFullUserData(),
          user?.shopingCart ? getCart(user.shopingCart.documentId) : null,
        ]);

        // Update user information if necessary
        if (
          !userData.body.fullName &&
          checkoutAddress?.firstName &&
          checkoutAddress?.lastName
        ) {
          userData.body.fullName =
            checkoutAddress.firstName + ' ' + checkoutAddress.lastName;
          await updateUserInformation(userData.body.id, `Bearer ${jwt}`, {
            fullName: userData.body.fullName,
          });
        }

        // Set user data
        setUser(userData.body);
        queryClient.setQueryData(['user'], userData.body);

        // Handle postal information (deferred)
        if (userData.body.postal_information) {
          const userPostalInformation = await getPostalInformation(
            userData.body.postal_information.documentId
          );
          if (checkoutAddress?.address && !userPostalInformation.length) {
            updatePostalInformation(
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

        // Handle cart (deferred)
        if (cartData && user) {
          handleCart(cartData.data.items, user.shopingCart.documentId);
        }

        // Redirect to home page
        router.push('/');
      } catch (error) {
        console.error('Error during login process:', error);
      } finally {
        setLoginProcces(false);
      }
    };

    if (!user && loginProcces) loginFn();
  }, [loginProcces, user, jwt, router]);

  useEffect(() => {
    const checkJwtCookie = async () => {
      const jwtCookie = await getCookie('jwt');
      if (!jwtCookie && jwt) {
        setCookie('jwt', 'Bearer ' + jwt);
      } else if (jwtCookie && !jwt) {
        const jwtWithoutBearer = jwtCookie.replace(/Bearer /g, '');
        setJwt(jwtWithoutBearer);
      } else if (jwt && !user) {
        const userData = await getFullUserData();
        setUser(userData.body);
      }
    };
    checkJwtCookie();
  }, [jwt, user, resetUser, resetCart]);

  return <></>;
}
