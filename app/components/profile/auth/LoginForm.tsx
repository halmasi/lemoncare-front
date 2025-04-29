'use client';

import { useRef } from 'react';
import InputBox from '@/app/components/formElements/InputBox';
import SubmitButton from '@/app/components/formElements/SubmitButton';
import { ErrorsProps, useLoginData } from '@/app/utils/states/useLoginData';
import { useMutation } from '@tanstack/react-query';
import { checkUserExists } from '@/app/utils/data/getUserInfo';

export default function LoginForm() {
  const identifierRef = useRef<HTMLInputElement>(null);
  const { setStep, setIdentifier, setErrors } = useLoginData();

  const loginCheckMutation = useMutation({
    mutationFn: async (identifier: string) => {
      const result = await checkUserExists(identifier);
      if (!result.success) {
        return { userExists: false };
      }
      return { userExists: true };
    },
    onSuccess: ({ userExists }) => {
      const identifier = identifierRef.current?.value || '';
      setIdentifier(identifier);
      setStep(userExists ? 'login' : 'register');
    },
    onError: () => {
      setErrors({
        identifier: ['کاربر یافت نشد. لطفاً ثبت‌نام کنید.'],
        username: [],
        password: [],
        email: [],
        server: [],
      });
      setStep('register');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const identifier = identifierRef.current?.value || '';
    loginCheckMutation.mutate(identifier);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputBox
        ref={identifierRef}
        name="identifier"
        placeholder="ایمیل یا شماره تلفن"
        required
      />
      {loginCheckMutation.isError && (
        <p className="text-red-500 text-sm">
          {loginCheckMutation.error?.message || 'خطایی رخ داده است.'}
        </p>
      )}
      <SubmitButton isPending={loginCheckMutation.status === 'pending'}>
        {loginCheckMutation.status === 'pending' ? 'در حال بررسی...' : 'ادامه'}
      </SubmitButton>
    </form>
  );
}
