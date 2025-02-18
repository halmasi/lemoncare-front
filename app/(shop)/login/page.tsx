'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import InputBox from '@/app/components/formElements/InputBox';
import SubmitButton from '@/app/components/formElements/SubmitButton';
import {
  getFullUserData,
  setCookie,
  signinAction,
} from '@/app/utils/actions/actionMethods';

import { useDataStore } from '@/app/utils/states/useUserdata';
import { CartProps, useCartStore } from '@/app/utils/states/useCartData';
import { updateCartOnLogin } from '@/app/utils/actions/cartActionMethods';

export default function LoginPage() {
  const router = useRouter();
  const { cart, setCart } = useCartStore();
  const { setJwt, setUser, user } = useDataStore();

  const [errors, setErrors] = useState<{
    email?: string[];
    password?: string[];
    server?: string[];
  }>({});
  const queryClient = useQueryClient();
  const loginMutauionFn = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const response = await signinAction(email, password);
      if (!response.success) {
        setErrors(response.fieldErrors);
        throw new Error('نام کاربری یا رمز عبور نادرست است');
      }
      await setCookie('jwt', `Bearer ${response.jwt}`);
      setJwt(response.jwt);
      const userData = await getFullUserData();

      return { response, userData };
    },
    onSuccess: async (data) => {
      setUser(data.userData.body);
      handleCart(data.userData.body.cart);
      queryClient.setQueryData(['user'], data.userData.body);
      router.push('/');
    },
    onError: (error: { message: string[] }) => {
      setErrors({ server: error.message });
    },
  });

  const updateCartFn = useMutation({
    mutationFn: async (newCart: CartProps[]) => {
      const updateCart = newCart.map((item) => {
        return {
          count: item.count,
          product: item.product,
          variety: item.variety,
        };
      });
      const res = await updateCartOnLogin(updateCart);
      return res;
    },
    onSuccess: async (data) => {
      if (!data || !user) return;
      const getUser = await getFullUserData();
      setCart(getUser.body.cart);
      setUser(getUser.body);
    },
    onError: (error: { message: string[] }) => {
      throw new Error('خطا : ' + error.message);
    },
  });

  const handleCart = (fetchedCart: CartProps[]) => {
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
        updateCartFn.mutate(cartItems);
      } else setCart(fetchedCart);
    } else if (fetchedCart && !cart) setCart(fetchedCart);
    else if (!fetchedCart && cart) updateCartFn.mutate(cart);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('identifier')?.toString() || '';
    const password = formData.get('password')?.toString() || '';
    loginMutauionFn.mutate({ email, password });
  };
  return (
    <div className="flex w-full justify-center items-center pt-5 px-10 gap-2 h-screen">
      <form
        className="w-full md:w-3/12 flex flex-col gap-2"
        onSubmit={handleSubmit}
      >
        <InputBox name="identifier" placeholder="ایمیل" />
        {errors?.email && (
          <p className="text-red-500 text-sm whitespace-pre-line">
            {errors.email.join('\n')}
          </p>
        )}

        <InputBox name="password" format="password" placeholder="رمزعبور" />
        {errors?.password && (
          <p className="text-red-500 text-sm whitespace-pre-line">
            {errors.password.join('\n')}
          </p>
        )}
        {errors?.server && (
          <p className="text-red-500 text-sm whitespace-pre-line">
            {errors.server}
          </p>
        )}

        <SubmitButton
          disabled={loginMutauionFn.isPending || updateCartFn.isPending}
        >
          {loginMutauionFn.isPending || updateCartFn.isPending
            ? 'در حال ورود...'
            : 'ورود'}
        </SubmitButton>
      </form>
    </div>
  );
}
