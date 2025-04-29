'use client';

import { useRef } from 'react';
import InputBox from '@/app/components/formElements/InputBox';
import SubmitButton from '@/app/components/formElements/SubmitButton';
import { useLoginData } from '@/app/utils/states/useLoginData';
import { useMutation } from '@tanstack/react-query';
import { checkUserExists } from '@/app/utils/data/getUserInfo';

export default function LoginForm() {
  const identifierRef = useRef<HTMLInputElement>(null);
  const { setStep, setIdentifier, setErrors, errors } = useLoginData();

  const loginCheckMutation = useMutation({
    mutationFn: async (identifier: string) => {
      const result = await checkUserExists(identifier);
      return { result };
    },
    onSuccess: (userExists) => {
      setStep(userExists ? 'register' : 'login');
    },
    onError: (error: Error) => {
      setErrors({
        identifier: [error.message],
        username: [],
        password: [],
        email: [],
        server: [],
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const enteredIdentifier = identifierRef.current?.value || '';
    console.log('Entered Identifier:', enteredIdentifier);
    setIdentifier(enteredIdentifier);
    loginCheckMutation.mutate(enteredIdentifier);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputBox
        ref={identifierRef}
        name="identifier"
        placeholder="ایمیل یا شماره تلفن"
        required
      />
      {errors.identifier && (
        <p className="text-red-500 text-sm">{errors.identifier.join('\n')}</p>
      )}
      <SubmitButton isPending={loginCheckMutation.status === 'pending'}>
        {loginCheckMutation.status === 'pending' ? 'در حال بررسی...' : 'ادامه'}
      </SubmitButton>
    </form>
  );
}
