'use client';

import { useRef } from 'react';
import PhoneInputBox from '@/app/components/formElements/PhoneInputBox';
import InputBox from '@/app/components/formElements/InputBox';
import SubmitButton from '@/app/components/formElements/SubmitButton';
import { useLoginData } from '@/app/utils/states/useLoginData';
import { useMutation } from '@tanstack/react-query';
import { registerAction } from '@/app/utils/actions/actionMethods';

export default function RegisterForm() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { setStep, setErrors } = useLoginData();

  const registerMutation = useMutation({
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
        throw new Error('نام کاربری تکراری است.');
      }
      return response.jwt;
    },
    onSuccess: () => {
      setStep('login');
    },
    onError: (error: Error) => {
      setErrors({
        identifier: [],
        username: [error.message],
        password: [],
        email: [],
        server: [],
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = usernameRef.current?.value || '';
    const email = emailRef.current?.value || '';
    const password = passwordRef.current?.value || '';
    registerMutation.mutate({ username, email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PhoneInputBox
        ref={usernameRef}
        name="username"
        placeholder="شماره تلفن"
        required
      />
      <InputBox ref={emailRef} name="email" placeholder="ایمیل" required />
      <InputBox
        ref={passwordRef}
        name="password"
        type="password"
        placeholder="رمزعبور"
        required
      />
      {registerMutation.isError && (
        <p className="text-red-500 text-sm">
          {registerMutation.error?.message}
        </p>
      )}
      <SubmitButton isPending={registerMutation.status === 'pending'}>
        {registerMutation.status === 'pending'
          ? 'در حال ثبت‌نام...'
          : 'ثبت‌نام'}
      </SubmitButton>
    </form>
  );
}
