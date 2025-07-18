'use client';

import { useRef } from 'react';
import InputBox from '@/app/components/formElements/InputBox';
import SubmitButton from '@/app/components/formElements/SubmitButton';
import { useLoginData } from '@/app/utils/states/useLoginData';
import { useMutation } from '@tanstack/react-query';
import { signinAction } from '@/app/utils/actions/actionMethods';
import { useDataStore } from '@/app/utils/states/useUserdata';

export default function PasswordForm() {
  const { email, username, setErrors } = useLoginData();
  const { setLoginProcces, setJwt } = useDataStore();

  const passwordRef = useRef<HTMLInputElement>(null);

  const loginMutation = useMutation({
    mutationFn: async (password: string) => {
      const identifier = email || username;
      const response = await signinAction(identifier, password);
      if (!response.success) {
        throw new Error('رمز عبور اشتباه است.');
      }
      return response;
    },
    onSuccess: (data) => {
      setJwt(data.jwt);
      setLoginProcces(true);
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
    loginMutation.mutateAsync(password);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputBox
        ref={passwordRef}
        name="password"
        type="password"
        placeholder="رمزعبور"
        required
        ltr
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
