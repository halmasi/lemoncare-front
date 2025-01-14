'use client';

import InputBox from '@/app/components/formElements/InputBox';
import SubmitButton from '@/app/components/formElements/SubmitButton';
import { setCookie, signinAction } from '@/app/utils/actions/actionMethods';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';

export default function Page() {
  const [formState, formAction] = useFormState(signinAction, {
    user: undefined,
    jwt: undefined,
  });

  const router = useRouter();

  const errors =
    formState.user?.success === false && formState.user?.fieldErrors
      ? formState.user.fieldErrors
      : {};

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
        className="w-full md:w-3/12 flex flex-col gap-2"
        action={formAction}
      >
        <InputBox name="identifier" placeholder="ایمیل" />
        {errors?.email && (
          <p className="text-red-500 text-sm">{errors.email[0]}</p>
        )}

        <InputBox name="password" format="password" placeholder="رمزعبور" />
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
