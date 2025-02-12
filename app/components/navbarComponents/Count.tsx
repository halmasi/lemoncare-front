'use client';

import { useDataStore } from '@/app/utils/states/useUserdata';
import { CartProps, useCartStore } from '@/app/utils/states/useCartData';
import { useCallback, useEffect, useState } from 'react';
import { BiMinus, BiPlus } from 'react-icons/bi';
import { RiDeleteBin2Fill } from 'react-icons/ri';
import { useMutation } from '@tanstack/react-query';
import { VscLoading } from 'react-icons/vsc';
import { updateCart } from '@/app/utils/actions/cartActionMethods';

export default function Count({
  inventory,
  cartItem,
}: {
  inventory: number;
  cartItem: CartProps;
}) {
  const { jwt, user } = useDataStore();
  const { cart, setCart } = useCartStore();

  const [number, setNumber] = useState(cartItem.count);

  const updateCartFn = useMutation({
    mutationFn: async (cart: CartProps[]) => {
      if (user && user.id && jwt && cart.length) {
        const res = await updateCart(user.id, cart, jwt);
        return res;
      }
    },
    onSuccess: (data) => {},
  });

  const itemIndex = cart.findIndex(
    (item: { id: number }) => item.id === cartItem.id
  );
  const itemCount = itemIndex !== -1 ? cart[itemIndex].count : 0;

  const handleCartUpdate = useCallback(
    (newCount: number) => {
      const safeCart = JSON.parse(JSON.stringify(cart));
      const updatedCart = safeCart.map((item: { id: number }) =>
        item.id === cartItem.id ? { ...item, count: newCount } : item
      );

      setCart(updatedCart);

      if (jwt && user) {
        const safeUser = JSON.parse(JSON.stringify(user));
        const safeUserCart = Array.isArray(safeUser.cart) ? safeUser.cart : [];

        const shouldUpdate = updatedCart.some(
          (item: { id: any; count: any }) => {
            const foundItem = safeUserCart.find(
              (cartItem: { id: any }) => cartItem.id === item.id
            );
            return foundItem?.count !== item.count;
          }
        );

        if (shouldUpdate) {
          updateCartFn.mutate(JSON.parse(JSON.stringify(updatedCart)));
        }
      }
    },
    [cart, setCart, jwt, user, updateCartFn]
  );

  useEffect(() => {
    if (cartItem.count > inventory) {
      setNumber(inventory);
    }
  }, [cartItem.count, inventory]);

  return (
    <>
      {cart.length > 0 && (
        <div className="flex h-7 bg-white border w-fit rounded-lg overflow-hidden items-center">
          {/* Increase Button */}
          <button
            onClick={() => {
              if (itemIndex !== -1 && cart[itemIndex].count < inventory) {
                setNumber((prev) => prev + 1);
                handleCartUpdate(number + 1);
              }
            }}
            disabled={
              itemIndex === -1 ||
              cart[itemIndex].count >= inventory ||
              updateCartFn.isPending
            }
            className={`p-1 border-l ${itemIndex !== -1 && cart[itemIndex].count < inventory ? 'hover:bg-gray-50' : ''}`}
          >
            <BiPlus
              className={`text-lg ${itemIndex === -1 || cart[itemIndex].count >= inventory ? 'text-gray-300' : 'text-accent-green'}`}
            />
          </button>

          {/* Item Count Display */}
          <p className="flex w-8 items-center justify-center">
            {updateCartFn.isPending ? (
              <VscLoading className="animate-spin" />
            ) : (
              itemCount
            )}
          </p>

          {/* Decrease Button */}
          <button
            onClick={() => {
              if (itemIndex !== -1 && cart[itemIndex].count > 1) {
                setNumber((prev) => prev - 1);
                handleCartUpdate(number - 1);
              }
            }}
            disabled={
              itemIndex === -1 ||
              cart[itemIndex].count <= 1 ||
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
