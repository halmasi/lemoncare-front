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

export default function LoginPage() {
  const [formState, formAction] = useFormState(signinAction, {
    success: false,
    user: '',
    jwt: '',
    fieldErrors: {},
  });
  const { setJwt, setUser } = useDataStore();
  const router = useRouter();

  const errors = formState?.fieldErrors as {
    email?: string[];
    password?: string[];
    server?: string[];
  };

  const handleLoginSuccess = useCallback(async () => {
    if (!formState.jwt || !formState.user) return;
    await setCookie('jwt', `Bearer ${formState.jwt}`);

    const userData = await getFullUserData(formState.jwt);
    setJwt(formState.jwt);
    setUser(userData.body);
    router.push('/dashboard');
  }, [formState.jwt, formState.user, setJwt, setUser, router]);

  useEffect(() => {
    handleLoginSuccess();
  }, [handleLoginSuccess]);
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
