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
import logs from '@/app/utils/logs';

export default function LoginPage() {
  const router = useRouter();
  const { setJwt, setUser } = useDataStore();

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
      await setCookie('jwt', `Bearer ${data.response.jwt}`);
      setJwt(data.response.jwt);
      setUser(data.userData.body);
      queryClient.setQueryData(['user'], data.userData.body);
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
    loginMutauionFn.mutate({ email, password });
  };
  const handleGoogleLogin = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    } else {
      logs('Google API not loaded yet.', 'error');
    }
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

        <SubmitButton disabled={loginMutauionFn.isPending}>
          {loginMutauionFn.isPending ? 'در حال ورود...' : 'ورود'}
        </SubmitButton>
      </form>
    </div>
  );
}
