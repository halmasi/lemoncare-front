'use client';

import { useDataStore } from '@/app/utils/states/useUserdata';
import { useCartStore } from '@/app/utils/states/useCartData';
import { useState } from 'react';
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
  refreshFunction: (count: number) => void;
}) {
  const router = useRouter();
  const { jwt, user } = useDataStore();
  const { cart, setCart } = useCartStore();

  const [number, setNumber] = useState(cartItem.count);

  const itemIndex = cart
    ? cart.findIndex((item) => {
        const bool =
          item.product.documentId == cartItem.product.documentId &&
          item.variety == cartItem.variety;
        return bool;
      })
    : -1;

  const itemCount = itemIndex != -1 ? cart[itemIndex].count : 0;

  const getCartFn = useMutation({
    mutationFn: async () => {
      if (!user) return;
      const getCartData = await getCart(user.shopingCart.documentId);
      return getCartData;
    },
    onSuccess: (data) => {
      if (!data.body || !data.body.items) return;
      setCart(data.body.items);
      router.refresh();
    },
  });

  const updateCartFn = useMutation({
    mutationFn: async (newCart: CartProps[]) => {
      if (user && user.id) {
        const res = await updateCart(newCart, user.shopingCart.documentId);
        return { result: res, prev: cart };
      }
    },
    onSuccess: async (data) => {
      if (!data || !data.result) return;
      getCartFn.mutate();
    },
    onError: async (error) => {
      logs.error(error.cause + ' ' + error.message);
    },
  });

  const changeNumberfn = useMutation({
    mutationFn: async (newNumber: number) => {
      const updateCart = cart;
      if (newNumber <= 0) {
        updateCart.splice(updateCart.indexOf(cartItem), 1);
        if (user && jwt) {
          updateCartFn.mutate(JSON.parse(JSON.stringify(updateCart)));
        }
        refreshFunction(0);
      } else {
        if (newNumber > inventory) newNumber = inventory;
        updateCart[updateCart.indexOf(cartItem)].count = newNumber;
        setCart(updateCart);

        if (jwt && user) {
          getCartFn.mutate();
          const cartMap = new Map(
            cart.map((cartItem) => [
              `${cartItem.product.documentId}-${cartItem.variety.id}-${cartItem.variety.sub}`,
              cartItem,
            ])
          );

          const shouldUpdate = updateCart.some((item) => {
            const key = `${item.product.documentId}-${item.variety.id}-${item.variety.sub}`;
            const foundItem = cartMap.get(key);
            return foundItem?.count !== item.count;
          });

          if (shouldUpdate) {
            updateCartFn.mutate(JSON.parse(JSON.stringify(updateCart)));
          }
        }
      }
      refreshFunction(newNumber);
    },
  });

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
                changeNumberfn.mutate(number + 1);
              }
            }}
            disabled={
              itemIndex === -1 ||
              cart[itemIndex].count >= inventory ||
              updateCartFn.isPending ||
              changeNumberfn.isPending
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
            {updateCartFn.isPending || changeNumberfn.isPending ? (
              <VscLoading className="animate-spin" />
            ) : (
              itemCount
            )}
          </p>

          <button
            onClick={() => {
              setNumber((prev) => prev - 1);
              changeNumberfn.mutate(number - 1);
            }}
            disabled={
              itemIndex === -1 ||
              cart[itemIndex].count <= 0 ||
              updateCartFn.isPending ||
              changeNumberfn.isPending
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
