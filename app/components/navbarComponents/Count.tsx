'use client';

import { useDataStore } from '@/app/utils/states/useUserdata';
import { CartProps, useCartStore } from '@/app/utils/states/useCartData';
import { useCallback, useEffect, useState } from 'react';
import { BiMinus, BiPlus } from 'react-icons/bi';
import { RiDeleteBin2Fill } from 'react-icons/ri';
import { useMutation } from '@tanstack/react-query';
import { VscLoading } from 'react-icons/vsc';
import { updateCart } from '@/app/utils/actions/cartActionMethods';
import { getFullUserData } from '@/app/utils/actions/actionMethods';
import log from '@/app/utils/logs';
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
  const { jwt, user, setUser } = useDataStore();
  const { cart, setCart } = useCartStore();

  const [number, setNumber] = useState(cartItem.count);

  const updateCartFn = useMutation({
    mutationFn: async (newCart: CartProps[]) => {
      if (user && user.id) {
        const res = await updateCart(newCart, user.id);
        return { result: res, prev: cart };
      }
    },
    onSuccess: async (data) => {
      if (!data || !data.result || !user) return;
      const getUser = await getFullUserData();
      setCart(getUser.body.cart);
      setUser(getUser.body);
      if (refreshFunction) refreshFunction();
    },
    onError: async (error) => {
      log(error.cause + error.message, 'error');
      if (refreshFunction) refreshFunction();
    },
    retry: 2,
    retryDelay: 1000,
  });

  const itemIndex = cart.findIndex(
    (item: { id: number }) => item.id === cartItem.id
  );
  const itemCount = itemIndex !== -1 ? cart[itemIndex].count : 0;

  const handleCartUpdate = useCallback(
    (newCount: number) => {
      const updateCart = cart;
      if (newCount <= 0) {
        updateCart.splice(updateCart.indexOf(cartItem), 1);
        if (user && jwt) {
          updateCartFn.mutate(JSON.parse(JSON.stringify(updateCart)));
        } else {
          setCart(updateCart);
        }
      } else {
        updateCart[updateCart.indexOf(cartItem)].count = newCount;

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
        } else {
          setCart(updateCart);
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
