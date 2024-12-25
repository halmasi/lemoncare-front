'use client';

import InputBox from '@/components/formElements/InputBox';
import SubmitButton from '@/components/formElements/SubmitButton';
import { signinAction } from '@/utils/actions/actionMethods';
import { useFormState } from 'react-dom';

export default function Page() {
  const [formState, formAction] = useFormState(signinAction, {
    data: null,
  });

  const { data } = formState;

  const errors =
    data?.success === false && data.data?.fieldErrors
      ? data.data.fieldErrors
      : {};

  return (
    <div className="flex w-full justify-center items-center pt-5 px-10 gap-2 h-svh">
      <form
        className="w-full md:w-3/12 flex flex-col gap-2"
        action={formAction}
      >
        <InputBox name="email" placeholder="ایمیل" />
        {errors?.email && (
          <p className="text-red-500 text-sm">{errors.email[0]}</p>
        )}

        <InputBox name="pass" format="password" placeholder="رمزعبور" />
        {errors?.pass && (
          <p className="text-red-500 text-sm">{errors.pass[0]}</p>
        )}

        <SubmitButton>ورود</SubmitButton>
      </form>
    </div>
  );
}
