'use client';

import React, { useEffect } from 'react';
import InputBox from '@/app/components/formElements/InputBox';
import SubmitButton from '@/app/components/formElements/SubmitButton';
import { registerAction, setCookie } from '@/app/utils/actions/actionMethods';
import { useRouter } from 'next/navigation';
import { useFormState } from 'react-dom';
import PhoneInputBox from '@/app/components/formElements/PhoneInputBox';

export default function register() {
  const [formState, formAction] = useFormState(registerAction, {
    user: undefined,
    jwt: undefined,
  });
  const errors =
    formState.user?.success === false && formState.user?.fieldErrors
      ? formState.user.fieldErrors
      : {};
  const router = useRouter();
  useEffect(() => {
    if (formState.jwt && formState.user) {
      setCookie('jwt', `Bearer ${formState.jwt}`).then(() => {
        router.push('/dashboard');
      });
    }
  }, [formState.user, router]);

  return (
    <div className="flex w-full justify-center items-center pt-5 px-10 gap-2 h-screen">
      <form
        className="w-full md:w-7/12 container flex flex-col gap-2"
        action={formAction}
      >
        <PhoneInputBox name="username" required placeholder="شماره تلفن">
          شماره موبایل
        </PhoneInputBox>
        {errors?.username && (
          <p className="text-red-500 text-sm">{errors.username[0]}</p>
        )}
        <InputBox name="email" required placeholder="ایمیل">
          ایمیل
        </InputBox>
        {errors?.email && (
          <p className="text-red-500 text-sm">{errors.email[0]}</p>
        )}
        <InputBox name="password" format="password" placeholder="رمزعبور">
          رمز عبور
        </InputBox>
        {errors?.password && (
          <p className="text-red-500 text-sm">{errors.password[0]}</p>
        )}

        {errors?.server && (
          <p className="text-red-500 text-sm">{errors.server[0]}</p>
        )}

        <SubmitButton>ورود</SubmitButton>
      </form>
    </div>
  );
}
