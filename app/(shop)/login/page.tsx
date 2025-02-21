'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import InputBox from '@/app/components/formElements/InputBox';
import SubmitButton from '@/app/components/formElements/SubmitButton';
import {
  getFullUserData,
  setCookie,
  signinAction,
} from '@/app/utils/actions/actionMethods';

import { useDataStore } from '@/app/utils/states/useUserdata';
import { useCartStore } from '@/app/utils/states/useCartData';
// import { updateCartOnLogin } from '@/app/utils/actions/cartActionMethods';

export default function LoginPage() {
  const router = useRouter();
  const { cart, setCart } = useCartStore();
  const { setJwt, setUser, user } = useDataStore();

  const [errors, setErrors] = useState<{
    email?: string[];
    password?: string[];
    server?: string[];
  }>({});

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
      }

      return response;
    },
    onSuccess: async (data) => {
      await setCookie('jwt', `Bearer ${data.jwt}`);
      setJwt(data.jwt);
      const userData = await getFullUserData();
      setUser(userData.body);
      // handleCart(userData.body.cart);
      router.push('/login/loading');
    },
    onError: (error: { message: string[] }) => {
      setErrors({ server: error.message });
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('identifier')?.toString() || '';
    const password = formData.get('password')?.toString() || '';
    setErrors({});
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
            {errors.server.join('\n')}
          </p>
        )}

        <SubmitButton disabled={loginMutauionFn.isPending}>
          {loginMutauionFn.isPending ? 'در حال ورود...' : 'ورود'}
        </SubmitButton>
      </form>
    </div>
  );
}
