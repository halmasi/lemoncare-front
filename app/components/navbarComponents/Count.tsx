'use client';

import { useDataStore } from '@/app/utils/states/useUserdata';
import { useCartStore } from '@/app/utils/states/useCartData';
import { useCallback, useEffect, useState } from 'react';
import { BiMinus, BiPlus } from 'react-icons/bi';
import { RiDeleteBin2Fill } from 'react-icons/ri';
import { useMutation } from '@tanstack/react-query';
import { VscLoading } from 'react-icons/vsc';
import { getCart, updateCart } from '@/app/utils/actions/cartActionMethods';
import { logs } from '@/app/utils/miniFunctions';
import { CartProps } from '@/app/utils/schema/shopProps';
import { useRouter } from 'next/navigation';
export default function Count({
  inventory,
  cartItem,
  refreshFunction,
  isProductPage,
}: {
  inventory: number;
  cartItem: CartProps;
  isProductPage?: boolean;
  refreshFunction?: () => void;
}) {
  const router = useRouter();
  const { jwt, user } = useDataStore();
  const { cart, setCart } = useCartStore();

  const [number, setNumber] = useState(cartItem.count);

  const updateCartFn = useMutation({
    mutationFn: async (newCart: CartProps[]) => {
      if (user && user.id) {
        const res = await updateCart(newCart, user.shopingCart.documentId);
        return { result: res, prev: cart };
      }
    },
    onSuccess: async (data) => {
      if (!data || !data.result || !user) return;
      const getCartData = await getCart(user.shopingCart.documentId);
      setCart(getCartData.body.items);
      router.refresh();
    },
    onError: async (error) => {
      logs.error(error.cause + ' ' + error.message);
      if (refreshFunction) refreshFunction();
    },
    retry: 2,
    retryDelay: 1000,
  });

  const itemIndex = cart
    ? cart.findIndex((item: { id: number }) => item.id === cartItem.id)
    : -1;
  const itemCount = itemIndex !== -1 ? cart[itemIndex].count : 0;

  const handleCartUpdate = useCallback(
    (newCount: number) => {
      const updateCart = cart;
      if (newCount <= 0) {
        updateCart.splice(updateCart.indexOf(cartItem), 1);
        setCart(updateCart);
        if (user && jwt) {
          updateCartFn.mutate(JSON.parse(JSON.stringify(updateCart)));
        }
      } else {
        updateCart[updateCart.indexOf(cartItem)].count = newCount;
        setCart(updateCart);
        if (jwt && user) {
          const safeUser = JSON.parse(JSON.stringify(user));
          const safeUserCart = Array.isArray(safeUser.cart)
            ? safeUser.cart
            : [];

          const shouldUpdate = updateCart.some(
            (item: { id: number; count: number }) => {
              const foundItem = safeUserCart.find(
                (cartItem: { id: number }) => cartItem.id == item.id
              );
              return foundItem?.count !== item.count;
            }
          );

          if (shouldUpdate) {
            updateCartFn.mutate(JSON.parse(JSON.stringify(updateCart)));
          }
        }
      }
    },
    [cart, setCart, jwt, user, updateCartFn]
  );

  useEffect(() => {
    if (cartItem.count > inventory) {
      setNumber(inventory);
      handleCartUpdate(inventory);
    }
  }, [cartItem.count, inventory]);

  return (
    <>
      {cart.length > 0 && (
        <div
          className={`flex ${isProductPage ? 'h-14' : 'h-7'} bg-white border w-fit rounded-lg overflow-hidden items-center`}
        >
          <button
            onClick={() => {
              if (cart[itemIndex].count < inventory) {
                setNumber((prev) => prev + 1);
                handleCartUpdate(number + 1);
              }
            }}
            disabled={
              itemIndex === -1 ||
              cart[itemIndex].count >= inventory ||
              updateCartFn.isPending
            }
            className={`p-1 border-l ${itemIndex === -1 || cart[itemIndex].count < inventory ? 'hover:bg-gray-50' : ''}`}
          >
            <BiPlus
              className={`${isProductPage ? 'text-2xl' : 'text-lg'} ${itemIndex === -1 || cart[itemIndex].count >= inventory ? 'text-gray-300' : 'text-accent-green'}`}
            />
          </button>

          <p
            className={`flex ${isProductPage ? 'w-12 text-xl' : 'w-8'} items-center justify-center`}
          >
            {updateCartFn.isPending ? (
              <VscLoading className="animate-spin" />
            ) : (
              itemCount
            )}
          </p>

          <button
            onClick={() => {
              setNumber((prev) => prev - 1);
              handleCartUpdate(number - 1);
            }}
            disabled={
              itemIndex === -1 ||
              cart[itemIndex].count <= 0 ||
              updateCartFn.isPending
            }
            className={`p-1 ${isProductPage ? 'text-2xl' : 'text-lg'} hover:bg-gray-50 border-r ${updateCartFn.isPending ? 'text-gray-300' : 'text-accent-pink'}`}
          >
            {itemIndex !== -1 && cart[itemIndex].count <= 1 ? (
              <RiDeleteBin2Fill />
            ) : (
              <BiMinus />
            )}
          </button>
        </div>
      )}
    </>
  );
}
