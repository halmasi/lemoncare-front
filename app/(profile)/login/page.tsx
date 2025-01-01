'use client';

import InputBox from '@/app/components/formElements/InputBox';
import SubmitButton from '@/app/components/formElements/SubmitButton';
import {
  logoutAction,
  setCookie,
  signinAction,
} from '@/app/utils/actions/actionMethods';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';

export default function Page() {
  const [formState, formAction] = useFormState(signinAction, {
    success: false,
    userdata: undefined,
    token: undefined,
  });

  const router = useRouter();

  // Extract errors if present
  const errors =
    formState.userdata?.success === false && formState.userdata?.fieldErrors
      ? formState.userdata.fieldErrors
      : {};

  // Redirect on successful login
  useEffect(() => {
    // console.log(formState);
    if (formState.userdata?.user && formState.userdata.success) {
      setCookie('token', formState.userdata.token);
      // router.push('/dashboard');
      console.log('##########');
    }
  }, [formState.userdata, router]);

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

      {/* Logout form */}
      <form onSubmit={logoutAction}>
        <button
          type="submit"
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          خروج
        </button>
      </form>
    </div>
  );
}
