'use client';

import { CartProps, useDataStore } from '@/app/utils/states/useUserdata';
import { useEffect, useState } from 'react';
import { BiMinus, BiPlus } from 'react-icons/bi';
import { RiDeleteBin2Fill } from 'react-icons/ri';
import { useUpdateCart } from '@/app/utils/states/useUpdateCart';
import { loginCheck } from '@/app/utils/actions/actionMethods';

export default function Count({
  inventory,
  cartItem,
}: {
  inventory: number;
  cartItem: CartProps;
}) {
  const { jwt, cart, setCart } = useDataStore();
  const [number, setNumber] = useState(cartItem.count);
  const { updateCart, loading, error } = useUpdateCart();

  useEffect(() => {
    const changeAmount = async () => {
      const newCart = cart;
      newCart[cart.indexOf(cartItem)].count = number;
      setNumber(newCart[cart.indexOf(cartItem)].count);
      setCart(newCart);

      if (jwt) {
        const check = await loginCheck();
        const userData: {
          id: number;
          documentId: string;
          email: string;
          provider: string;
          confirmed: boolean;
          blocked: boolean;
          createdAt: string;
          updatedAt: string;
          publishedAt: string;
          username: string;
          fullName: string;
        } = check.body.data;

        await updateCart(newCart, userData.id);
      }
    };

    if (cartItem.count > inventory) {
      setNumber(inventory);
    } else {
      if (cart && cart.length) changeAmount();
    }
  }, [number, cart, jwt, cartItem, setCart, updateCart]);

  return (
    <>
      {loading && <p>Updating cart...</p>}
      {error && <p>Error: {error.message}</p>}
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
