'use client';
import { getFullUserData } from '@/app/utils/actions/actionMethods';
import {
  getCart,
  updateCartOnLogin,
} from '@/app/utils/actions/cartActionMethods';
import { CartProps } from '@/app/utils/schema/shopProps/cartProps';
import { useCartStore } from '@/app/utils/states/useCartData';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function page() {
  const { cart, setCart } = useCartStore();
  const { setJwt, setUser, user } = useDataStore();

  const router = useRouter();

  const handleCart = (fetchedCart: CartProps[], id: string) => {
    if (fetchedCart && cart) {
      let updateNeeded = false;
      fetchedCart.map((fetched) => {
        let found = false;
        cart.map((item) => {
          if (
            item.product.documentId == fetched.product.documentId &&
            item.variety == fetched.variety
          ) {
            found = true;
          }
        });
        if (!found) updateNeeded = true;
      });
      if (updateNeeded) {
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
      } else setCart(fetchedCart);
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
          product: item.product,
          variety: item.variety,
        };
      });
      const update = await updateCartOnLogin(updateCart, id);
      const res = await getCart(id);
      console.log(res);
      return res.data;
    },
    onSuccess: async (data) => {
      if (!data) return;
      setCart(data.items);
      //   router.push('/');
    },
    onError: (error: { message: string[] }) => {
      throw new Error('خطا : ' + error.message);
    },
  });
  useEffect(() => {
    (async () => {
      const userData = await getFullUserData();
      getCartFn.mutate(userData.body.shopingCart.documentId);
    })();
  }, []);

  return <div>page</div>;
}
