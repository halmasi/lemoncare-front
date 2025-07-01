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
import { logs } from '@/app/utils/miniFunctions';
import { CartProps } from '@/app/utils/schema/shopProps';
import { useCartStore } from '@/app/utils/states/useCartData';
import { useCheckoutStore } from '@/app/utils/states/useCheckoutData';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginHandler() {
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

  const router = useRouter();

  const handleCartFn = useMutation({
    mutationFn: async ({
      fetchedCart,
      id,
    }: {
      fetchedCart: CartProps[];
      id: string;
    }) => {
      if (fetchedCart && cart) {
        const cartMap = new Map<string, CartProps>();
        [...fetchedCart, ...cart].forEach((item) => {
          const key = `${item.product.documentId}-${item.variety.id}-${item.variety.sub}`;
          cartMap.set(key, item);
        });
        const deduplicatedCart = Array.from(cartMap.values());
        await updateCartFn.mutateAsync({ newCart: deduplicatedCart, id });
      } else if (fetchedCart && !cart) {
        setCart(fetchedCart);
      } else if (!fetchedCart && cart) {
        await updateCartFn.mutateAsync({ newCart: cart, id });
      }
    },
    onSuccess: async () => {},
    onError: (error: { message: string[] }) => {
      throw new Error('خطا : ' + error.message);
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

  const loginFn = useMutation({
    mutationFn: async () => {
      await setCookie('jwt', `Bearer ${jwt}`);

      const userData = await getFullUserData();
      setUser(userData.body);

      const cartData = await getCart(userData.body.shopingCart.documentId);

      if (cartData && userData.body) {
        await handleCartFn.mutateAsync({
          fetchedCart: cartData.data.items,
          id: userData.body.shopingCart.documentId,
        });
      }

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

      if (userData.body.postal_information) {
        const userPostalInformation = await getPostalInformation(
          userData.body.postal_information.documentId
        );
        if (checkoutAddress?.address && !userPostalInformation.length) {
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
    },
    onSuccess: () => {
      router.refresh();
      setLoginProcces(false);
    },
    onError: (error: { message: string[] }) => {
      logs.error('Login error: ' + error.message);
    },
  });

  useEffect(() => {
    if (!user && loginProcces) {
      loginFn.mutate();
    }
  }, [loginProcces, user, jwt, setLoginProcces]);

  useEffect(() => {
    router.refresh();
  }, [loginProcces, setLoginProcces]);

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
  }, [jwt, user, resetUser, resetCart, loginProcces]);

  return null;
}
