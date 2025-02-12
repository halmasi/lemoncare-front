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

export default function Count({
  inventory,
  cartItem,
  deleteFunction,
}: {
  inventory: number;
  cartItem: CartProps;
  deleteFunction: (cartItem: CartProps) => void;
}) {
  const { jwt, user, setUser } = useDataStore();
  const { cart, setCart } = useCartStore();

  const [number, setNumber] = useState(cartItem.count);

  const updateCartFn = useMutation({
    mutationFn: async (cart: CartProps[]) => {
      if (user && user.id && cart.length) {
        const res = await updateCart(cart, user.id);
        return res;
      }
    },
    onSuccess: async (data) => {
      if (!data || !user) return;

      const getUser = await getFullUserData();
      setCart(getUser.body.cart);
      const newUser = user;
      newUser.cart = getUser.body.cart;
      setUser(newUser);
    },
    onError: async (error) => {
      console.log(error.cause);
    },
  });

  const itemIndex = cart.findIndex(
    (item: { id: number }) => item.id === cartItem.id
  );
  const itemCount = itemIndex !== -1 ? cart[itemIndex].count : 0;

  const handleCartUpdate = useCallback(
    (newCount: number) => {
      if (newCount == 0) {
        deleteFunction(cartItem);
      } else {
        const updateCart = cart;
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
        }
        setCart(updateCart);
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
        <div className="flex h-7 bg-white border w-fit rounded-lg overflow-hidden items-center">
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
              className={`text-lg ${itemIndex === -1 || cart[itemIndex].count >= inventory ? 'text-gray-300' : 'text-accent-green'}`}
            />
          </button>

          <p className="flex w-8 items-center justify-center">
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
            className={`p-1 text-lg hover:bg-gray-50 border-r ${updateCartFn.isPending ? 'text-gray-300' : 'text-accent-pink'}`}
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
