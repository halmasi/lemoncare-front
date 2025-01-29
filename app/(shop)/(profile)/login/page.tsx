'use client';

import InputBox from '@/app/components/formElements/InputBox';
import SubmitButton from '@/app/components/formElements/SubmitButton';
import {
  getFullUserData,
  setCookie,
  signinAction,
} from '@/app/utils/actions/actionMethods';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useDataStore } from '@/app/utils/states/useUserdata';

export default function Page() {
  const [formState, formAction] = useFormState(signinAction, {
    success: false,
    user: '',
    jwt: '',
    fieldErrors: {},
  });

  const router = useRouter();

  const errors = formState?.fieldErrors as {
    email?: string[];
    password?: string[];
    server?: string[];
  };

  const { setJwt, setUser } = useDataStore();
  useEffect(() => {
    if (formState.jwt && formState.user) {
      setCookie('jwt', `Bearer ${formState.jwt}`).then(async () => {
        setJwt(formState.jwt);
        setUser(
          (
            await getFullUserData(formState.jwt, [
              { postalInformation: { populate: '*' } },
            ])
          ).body
        );
        router.push('/dashboard');
      });
    }
  }, [formState.jwt, formState.user, router, setJwt, setUser]);
  return (
    <div className="flex w-full justify-center items-center pt-5 px-10 gap-2 h-screen">
      <form
        className="w-full md:w-3/12 flex flex-col gap-2"
        action={formAction}
      >
        <InputBox name="identifier" placeholder="ایمیل" />

        {errors?.email && (
          <p className="text-red-500 text-sm">{errors.email[0]}</p>
        )}
        <InputBox name="password" format="password" placeholder="رمزعبور" />

        {errors?.server && (
          <p className="text-red-500 text-sm">{errors.server[0]}</p>
        )}

        <SubmitButton>ورود</SubmitButton>
      </form>
    </div>
  );
}
