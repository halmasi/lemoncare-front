'use client';

import { useRef } from 'react';
import InputBox from '@/app/components/formElements/InputBox';
import SubmitButton from '@/app/components/formElements/SubmitButton';
import { useLoginData } from '@/app/utils/states/useLoginData';
import { useMutation } from '@tanstack/react-query';
import { signinAction } from '@/app/utils/actions/actionMethods';

export default function PasswordForm() {
  const passwordRef = useRef<HTMLInputElement>(null);
  const { identifier, setErrors } = useLoginData();

  const loginMutation = useMutation({
    mutationFn: async (password: string) => {
      const response = await signinAction(identifier, password);
      if (!response.success) {
        throw new Error('رمز عبور اشتباه است.');
      }
      return response.jwt;
    },
    onSuccess: () => {
      console.log('Login successful');
    },
    onError: (error: Error) => {
      setErrors({
        identifier: [],
        username: [],
        password: [error.message],
        email: [],
        server: [],
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const password = passwordRef.current?.value || '';
    loginMutation.mutate(password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputBox
        ref={passwordRef}
        name="password"
        type="password"
        placeholder="رمزعبور"
        required
      />
      {loginMutation.isError && (
        <p className="text-red-500 text-sm">{loginMutation.error?.message}</p>
      )}
      <SubmitButton isPending={loginMutation.status === 'pending'}>
        {loginMutation.status === 'pending' ? 'در حال ورود...' : 'ورود'}
      </SubmitButton>
    </form>
  );
}
