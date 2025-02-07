'use client';

import { updateCart } from '@/app/utils/actions/cartActionMethods';
import { CartProps, useDataStore } from '@/app/utils/states/useUserdata';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { BiMinus, BiPlus } from 'react-icons/bi';
import { RiDeleteBin2Fill } from 'react-icons/ri';

export default function Count({
  inventory,
  cartItem,
}: {
  inventory: number;
  cartItem: CartProps;
}) {
  const { jwt, cart, setCart } = useDataStore();

  const [number, setNumber] = useState(cartItem.count);

  // const mutation = useMutation({
  //   mutationFn: async ({ cart }: { cart: CartProps[] }) => {
  //     await updateCart(cart);
  //   },
  //   onSuccess: async (data: any) => {
  //     console.log(data);
  //   },
  //   onError: (error: any) => {},
  // });

  useEffect(() => {
    const changeAmount = () => {
      const newCart = cart;
      newCart[cart.indexOf(cartItem)].count = number;
      setNumber(newCart[cart.indexOf(cartItem)].count);
      setCart(newCart);
      // if (jwt) mutation.mutate({ cart });
    };

    if (cartItem.count > inventory) {
      setNumber(inventory);
    } else {
      if (cart.length) changeAmount();
    }
  }, [number, cart]);

  return (
    <>
      {cart.length && (
        <div className="flex h-7 bg-white border w-fit rounded-lg overflow-hidden items-center">
          <button
            onClick={() => {
              setNumber(number + 1);
            }}
            disabled={cart[cart.indexOf(cartItem)].count >= inventory}
            className={`p-1 border-l ${cart[cart.indexOf(cartItem)].count < inventory && 'hover:bg-gray-50'}`}
          >
            <BiPlus
              className={`text-lg ${cart[cart.indexOf(cartItem)].count >= inventory ? 'text-gray-300' : 'text-accent-green'}`}
            />
          </button>
          <p className="w-8 text-center">
            {cart[cart.indexOf(cartItem)].count}
          </p>
          <button
            onClick={() => {
              setNumber(number - 1);
            }}
            disabled={cart[cart.indexOf(cartItem)].count <= 0}
            className={`p-1 text-lg hover:bg-gray-50 border-r text-accent-pink`}
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
