'use client';

import { useCartStore } from '@/app/utils/states/useCartData';
import { ReactNode, useEffect, useState } from 'react';
import Table from '../Table';
import Image from 'next/image';
import Link from 'next/link';
import Count from './Count';
import { useDataStore } from '@/app/utils/states/useUserdata';
import {
  getCart,
  updateCart,
  updateCartOnLogin,
} from '@/app/utils/actions/cartActionMethods';
import { useRouter } from 'next/navigation';
import Toman from '../Toman';
import { varietyFinder } from '@/app/utils/shopUtils';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { CartProps, ProductProps } from '@/app/utils/schema/shopProps';
import LoadingAnimation from '../LoadingAnimation';
import { getProduct } from '@/app/utils/data/getProducts';

export default function Cart({
  priceAmount,
}: {
  priceAmount?: (main: number, before: number, count: number) => void;
}) {
  const { cart, setCart } = useCartStore();
  const { user, jwt, loginProcces, setLoginProcces } = useDataStore();

  const route = useRouter();

  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalBeforePrice, setTotalBeforePrice] = useState<number>(0);
  const [items, setItems] = useState<
    {
      cart: CartProps;
      product: ProductProps;
      color: string;
      inventory: number;
      mainPrice: number;
      priceBeforeDiscount: number;
      specification: string;
    }[]
  >([]);

  const getCartFn = useMutation({
    mutationFn: async ({
      id,
      login = false,
    }: {
      id: string;
      login?: boolean;
    }) => {
      const cartData = await getCart(id);
      if (!cartData) return { cartData: cartData.data, login };
    },
    onSuccess: (data) => {
      if (!data || !data.cartData) return;
      // setTotalPrice()
      const { cartData, login } = data;
      if (login && user && cartData && cartData.items) {
        handleCartFn.mutate({
          fetchedCart: cartData.items,
          id: user.shopingCart.documentId,
        });
        setLoginProcces(false);
      } else setCart(cartData.items);
      updateTotalPrice();
    },
    onError: () => {
      toast.error('خطا در بارگذاری سبد خرید');
    },
    onSettled: () => updateTotalPrice(),
  });

  const updateCartFn = useMutation({
    mutationFn: async ({
      cart,
      cartId,
    }: {
      cart: CartProps[];
      cartId: string;
    }) => {
      await updateCart(cart, cartId);
      return cartId;
    },
    onSuccess: async (id) => {
      getCartFn.mutateAsync({
        id,
        login: true,
      });
    },
    onError: () => {
      toast.error('خطا در بارگذاری سبد خرید');
    },
  });

  const updateCartOnLoginFn = useMutation({
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
      updateTotalPrice();
    },
    onError: (error: { message: string[] }) => {
      throw new Error('خطا : ' + error.message);
    },
  });

  const handleCartFn = useMutation({
    mutationFn: async ({
      fetchedCart,
      id,
    }: {
      fetchedCart: CartProps[];
      id: string;
    }) => {
      if (fetchedCart.length && cart) {
        const cartMap = new Map<string, CartProps>();
        [...fetchedCart, ...cart].forEach((item) => {
          const key = `${item.product.documentId}-${item.variety.id}-${item.variety.sub}`;
          cartMap.set(key, item);
        });
        const deduplicatedCart = Array.from(cartMap.values());
        updateCartOnLoginFn.mutate({ newCart: deduplicatedCart, id });
      } else if (fetchedCart.length && !cart) {
        setCart(fetchedCart);
      } else if (!fetchedCart.length && cart) {
        updateCartOnLoginFn.mutate({ newCart: cart, id });
      }
    },
    onSuccess: async () => {},
    onError: (error: { message: string[] }) => {
      throw new Error('خطا : ' + error.message);
    },
  });

  const updateTotalPrice = () => {
    if (!items || !Array.isArray(items) || items.length <= 0) {
      setTotalPrice(0);
      setTotalBeforePrice(0);
      if (priceAmount) priceAmount(0, 0, 0);
      return;
    }
    setTotalBeforePrice(0);
    let before = 0;
    let main = 0;
    setTotalPrice(0);
    items.map((item) => {
      main += item.mainPrice * item.cart.count;
      before += item.priceBeforeDiscount * item.cart.count;
    });
    setTotalPrice(main);
    setTotalBeforePrice(before);
    if (priceAmount) priceAmount(main, before, items.length);
  };

  // useEffect(() => {
  //   if (items && Array.isArray(items) && items.length) {
  //     setCount(items.length);
  //   } else setCount(0);
  // }, [items]);

  useEffect(() => {
    if (user && jwt && user.shopingCart)
      if (loginProcces) {
        getCartFn.mutate({
          id: user.shopingCart.documentId,
          login: true,
        });
      } else getCartFn.mutate({ id: user.shopingCart.documentId });
  }, [jwt, loginProcces]);

  useEffect(() => {
    updateTotalPrice();
  }, [totalBeforePrice, totalPrice]);

  useEffect(() => {
    if (cart && Array.isArray(cart) && cart.length) {
      setTotalPrice(0);
      setTotalBeforePrice(0);
      cart.map(async (item) => {
        const data = await getProduct({ slug: item.product.documentId });
        const product = data.res[0];
        const {
          color,
          inventory,
          mainPrice,
          priceBefforDiscount,
          specification,
        } = varietyFinder(item.variety, product);
        setItems([
          ...items,
          {
            cart: item,
            color,
            inventory,
            mainPrice,
            priceBeforeDiscount: priceBefforDiscount,
            specification,
            product,
          },
        ]);
        setTotalPrice(totalPrice + mainPrice * item.count);
        setTotalBeforePrice(
          totalBeforePrice + priceBefforDiscount * item.count
        );
      });
    }
  }, [cart, setCart]);

  if (getCartFn.status == 'pending' || updateCartFn.status == 'pending')
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <LoadingAnimation />
        <p>در حال بارگذاری سبد خرید</p>
      </div>
    );

  return (
    <div className="w-full">
      {items && Array.isArray(items) && items.length > 0 ? (
        <div>
          {items.map((cartItem, index) => {
            return (
              <div key={index}>
                <div className="w-full flex flex-col bg-gray-100/50 rounded-lg overflow-hidden border">
                  <div className="flex w-full h-24">
                    <Link
                      className="w-full pr-3"
                      href={`/shop/product/${cartItem.product.basicInfo.contentCode}`}
                    >
                      <p className="font-bold">
                        {cartItem.product.basicInfo.title}
                      </p>
                      <div className="flex items-center gap-1">
                        <div
                          style={{ background: cartItem.color }}
                          className={`w-4 h-4 rounded-full border border-foreground`}
                        />
                        <p>{cartItem.specification}</p>
                      </div>
                    </Link>
                    <Link
                      key={index}
                      href={`/shop/product/${cartItem.product.basicInfo.contentCode}`}
                      className="w-32 overflow-hidden border rounded-lg m-1"
                    >
                      <Image
                        src={
                          cartItem.product.basicInfo.mainImage.formats.thumbnail
                            .url
                        }
                        alt=""
                        width={
                          cartItem.product.basicInfo.mainImage.formats.thumbnail
                            .width
                        }
                        height={
                          cartItem.product.basicInfo.mainImage.formats.thumbnail
                            .height
                        }
                        className="object-cover w-full"
                      />
                    </Link>
                  </div>
                  <div
                    key={index}
                    className="flex justify-between w-full h-full bg-accent-yellow/25 px-5 py-2 items-center"
                  >
                    <div className="w-full h-full">
                      <Count
                        refreshFunction={(newCount) => {
                          if (user && user.shopingCart.documentId) {
                            if (newCount <= 0) {
                              const newCart = [...items];
                              newCart.splice(
                                newCart.findIndex(
                                  (i) => i.cart == cartItem.cart
                                ),
                                1
                              );
                              setItems(newCart);
                              getCartFn.mutate({
                                id: user.shopingCart.documentId,
                              });
                            } else {
                              updateCartFn.mutate({
                                cart,
                                cartId: user.shopingCart.documentId,
                              });
                            }
                          }
                          updateTotalPrice();
                        }}
                        key={index}
                        cartItem={cartItem.cart}
                        inventory={cartItem.inventory}
                      />
                    </div>
                    <div className="flex flex-wrap w-full items-center justify-end gap-2">
                      <h6 className="text-accent-pink text-base">قیمت:</h6>
                      {cartItem.priceBeforeDiscount > 0 && (
                        <p className="line-through text-gray-400 text-xs">
                          {(
                            (cartItem.priceBeforeDiscount *
                              cartItem.cart.count) /
                            10
                          ).toLocaleString('fa-IR')}
                        </p>
                      )}
                      <Toman className="font-bold text-accent-green fill-accent-green">
                        <p>
                          {(
                            (cartItem.mainPrice * cartItem.cart.count) /
                            10
                          ).toLocaleString('fa-IR')}
                        </p>
                      </Toman>
                    </div>
                  </div>
                </div>
                <div></div>
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <p>سبد خرید خالی است</p>
        </div>
      )}
    </div>
  );
}
