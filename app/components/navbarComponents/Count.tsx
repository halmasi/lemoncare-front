'use client';

import { useDataStore } from '@/app/utils/states/useUserdata';
import { CartProps, useCartStore } from '@/app/utils/states/useCartData';
import { useEffect, useState } from 'react';
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
        await updateCart(user.id, cart, jwt);
      }
    },
    onSuccess: async (data: any) => {
      console.log(data);
    },
    // onError: (error: any) => {
    //   console.log(error);
    // },
  });

  useEffect(() => {
    const changeAmount = async () => {
      const newCart = cart;
      newCart[cart.indexOf(cartItem)].count = number;
      setNumber(newCart[cart.indexOf(cartItem)].count);
      setCart(newCart);

      if (jwt && user) {
        let update = false;
        cart.map((item) => {
          const findCartItem = user.cart.find((cartItem) => {
            return cartItem.id == item.id;
          });
          if (findCartItem?.count != item.count) {
            update = true;
          }
        });
        if (update) updateCartFn.mutate(cart);
      }
    };

    if (cartItem.count > inventory) {
      setNumber(inventory);
    } else if (cart && cart.length) changeAmount();
  }, [number, cart, jwt, cartItem, setCart]);

  return (
    <>
      {cart.length && (
        <div className="flex h-7 bg-white border w-fit rounded-lg overflow-hidden items-center">
          <button
            onClick={() => {
              setNumber(number + 1);
            }}
            disabled={
              cart[cart.indexOf(cartItem)].count >= inventory ||
              updateCartFn.isPending
            }
            className={`p-1 border-l ${cart[cart.indexOf(cartItem)].count < inventory && 'hover:bg-gray-50'}`}
          >
            <BiPlus
              className={`text-lg ${cart[cart.indexOf(cartItem)].count >= inventory || updateCartFn.isPending ? 'text-gray-300' : 'text-accent-green'}`}
            />
          </button>
          <p className="flex w-8 items-center justify-center">
            {updateCartFn.isPending ? (
              <VscLoading className="animate-spin" />
            ) : (
              cart[cart.indexOf(cartItem)].count
            )}
          </p>
          <button
            onClick={() => {
              setNumber(number - 1);
            }}
            disabled={
              cart[cart.indexOf(cartItem)].count <= 0 || updateCartFn.isPending
            }
            className={`p-1 text-lg hover:bg-gray-50 border-r ${updateCartFn.isPending ? 'text-gray-300' : 'text-accent-pink'}`}
          >
            {cart[cart.indexOf(cartItem)].count <= 1 ? (
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
