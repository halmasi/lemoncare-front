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

import { CartProps, useDataStore } from '@/app/utils/states/useUserdata';

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setJwt, setUser, cart, setCart } = useDataStore();
  const [errors, setErrors] = useState<{
    email?: string[];
    password?: string[];
    server?: string[];
  }>({});

  const mutation = useMutation({
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
      }

      await setCookie('jwt', `Bearer ${response.jwt}`);
      setJwt(response.jwt);
      return response;
    },
    onSuccess: async (data: any) => {
      const userData = await getFullUserData(data.jwt);
      setUser(userData.body);
      handleCart(userData.body.cart);
      queryClient.setQueryData(['user'], userData.body);
      router.push('/dashboard');
    },
    onError: (error: any) => {
      setErrors({ server: error.message });
    },
  });

  const handleCart = (fetchedCart: CartProps[]) => {
    if (fetchedCart != cart) {
      const carts = fetchedCart;
      carts.forEach((item) => {
        let dup = 0;
        carts.forEach((check) => {
          if (
            item.product.documentId == check.product.documentId &&
            item.variety.id == check.variety.id &&
            item.variety.sub == check.variety.sub
          ) {
            dup++;
            if (dup > 1) {
              carts.splice(carts.indexOf(item), 1);
            }
          }
        });
      });
      setCart(carts);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('identifier')?.toString() || '';
    const password = formData.get('password')?.toString() || '';
    setErrors({});
    mutation.mutate({ email, password });
  };
  return (
    <div className="flex w-full justify-center items-center pt-5 px-10 gap-2 h-screen">
      <form
        className="w-full md:w-3/12 flex flex-col gap-2"
        onSubmit={handleSubmit}
      >
        <InputBox name="identifier" placeholder="ایمیل" />
        {errors?.email && (
          <p className="text-red-500 text-sm">{errors.email}</p>
        )}

        <InputBox name="password" format="password" placeholder="رمزعبور" />
        {errors?.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}
        {errors?.server && (
          <p className="text-red-500 text-sm">{errors.server}</p>
        )}

        <SubmitButton disabled={mutation.isPending}>
          {mutation.isPending ? 'در حال ورود...' : 'ورود'}
        </SubmitButton>
      </form>
    </div>
  );
}
