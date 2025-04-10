'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import InputBox from '@/app/components/formElements/InputBox';
import SubmitButton from '@/app/components/formElements/SubmitButton';
import PhoneInputBox from '@/app/components/formElements/PhoneInputBox';
import { registerAction, setCookie } from '@/app/utils/actions/actionMethods';
import { useDataStore } from '@/app/utils/states/useUserdata';

export default function RegisterPage() {
  const { setJwt } = useDataStore();

  const [errors, setErrors] = useState<{
    username?: string[];
    email?: string[];
    password?: string[];
    server?: string[];
  }>({});

  const mutation = useMutation({
    mutationFn: async ({
      username,
      email,
      password,
    }: {
      username: string;
      email: string;
      password: string;
    }) => {
      const response = await registerAction(username, email, password);

      if (!response.success) {
        setErrors(response.fieldErrors);
      }

      await setCookie('jwt', `Bearer ${response.jwt}`);
      setJwt(response.jwt);
      return response;
    },
    onSuccess: async (data) => {
      if (data.success) {
      }
    },
    onError: (error: { message: string[] }) => {
      setErrors({ server: error.message });
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const username = formData.get('username')?.toString() || '';
    const email = formData.get('email')?.toString() || '';
    const password = formData.get('passwordS')?.toString() || '';

    setErrors({});
    mutation.mutate({ username, email, password });
  };

  return (
    <div className="flex flex-col w-full justify-center items-center pt-5 px-10 gap-2 h-screen">
      <form
        className="w-full md:w-7/12 container flex flex-col gap-2"
        onSubmit={handleSubmit}
      >
        <PhoneInputBox name="username" required placeholder="شماره تلفن">
          شماره موبایل
        </PhoneInputBox>
        {errors?.username && (
          <p className="text-red-500 text-sm whitespace-pre-line">
            {errors.username.join('\n')}
          </p>
        )}

        <InputBox name="email" required placeholder="ایمیل">
          ایمیل
        </InputBox>
        {errors?.email && (
          <p className="text-red-500 text-sm whitespace-pre-line">
            {errors.email.join('\n')}
          </p>
        )}

        <InputBox name="passwordS" format="password" placeholder="رمزعبور">
          رمز عبور
        </InputBox>
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

        <SubmitButton disabled={mutation.isPending}>
          {mutation.isPending ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
        </SubmitButton>
      </form>
    </div>
  );
}
