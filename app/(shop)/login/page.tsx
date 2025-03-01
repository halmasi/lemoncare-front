'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDataStore } from '@/app/utils/states/useUserdata';
import InputBox from '@/app/components/formElements/InputBox';
import SubmitButton from '@/app/components/formElements/SubmitButton';
import PhoneInputBox from '@/app/components/formElements/PhoneInputBox';
import {
  signinAction,
  registerAction,
  setCookie,
  getFullUserData,
  checkUserExists,
} from '@/app/utils/actions/actionMethods';
import { motion } from 'framer-motion';

export default function AuthPage() {
  const [step, setStep] = useState<'identifier' | 'login' | 'register'>(
    'identifier'
  );
  const [identifier, setIdentifier] = useState('');
  const [errors, setErrors] = useState<{
    identifier?: string[];
    username?: string[];
    password?: string[];
    email?: string[];
    server?: string[];
  }>({});
  const { setJwt, setUser } = useDataStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async ({
      identifier,
      password,
    }: {
      identifier: string;
      password: string;
    }) => {
      const response = await signinAction(identifier, password);

      if (!response.success) {
        setErrors((prev) => ({ ...prev, ...response.fieldErrors }));
        throw new Error();
      }

      await setCookie('jwt', `Bearer ${response.jwt}`);
      setJwt(response.jwt);
      const userData = await getFullUserData();

      return { response, userData };
    },
    onSuccess: async (data) => {
      if (!data) return; // Prevent navigation if data is undefined
      await setCookie('jwt', `Bearer ${data.response.jwt}`);
      setJwt(data.response.jwt);
      setUser(data.userData.body);
      queryClient.setQueryData(['user'], data.userData.body);
      router.push('/login/loading');
    },
  });

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
        setErrors((prev) => ({ ...prev, ...response.fieldErrors }));
        throw new Error();
      }
      await setCookie('jwt', `Bearer ${response.jwt}`);
      setJwt(response.jwt);
      return response;
    },
    onSuccess: async (data) => {
      if (!data) return;
      setStep('login');
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (step === 'identifier') {
      const enteredIdentifier = formData.get('identifier')?.toString() || '';
      setIdentifier(enteredIdentifier);

      const result = await checkUserExists(enteredIdentifier);
      console.log('identify :', result);
      setStep(result.success ? 'login' : 'register');
    } else if (step === 'login') {
      loginMutation.mutate({
        identifier,
        password: formData.get('password')?.toString() || '',
      });
    } else if (step === 'register') {
      registerMutation.mutate({
        username: formData.get('username')?.toString() || '',
        email: formData.get('email')?.toString() || '',
        password: formData.get('password')?.toString() || '',
      });
    }
  };

  return (
    <div className="flex w-full justify-center items-center h-screen">
      <motion.form
        className="w-full md:w-3/12 flex flex-col gap-2"
        onSubmit={handleSubmit}
      >
        {step === 'identifier' && (
          <>
            <InputBox name="identifier" placeholder="ایمیل یا شماره تلفن" />
            {errors.identifier && (
              <p className="text-red-500 text-sm">
                {errors.identifier.join('\n')}
              </p>
            )}
            <SubmitButton>ادامه</SubmitButton>
          </>
        )}
        {step === 'login' && (
          <>
            <InputBox name="password" format="password" placeholder="رمزعبور" />
            {errors.password && (
              <p className="text-red-500 text-sm">
                {errors.password.join('\n.\n')}
              </p>
            )}
            {errors.server && (
              <p className="text-red-500 text-sm">{errors.server.join('\n')}</p>
            )}
            <SubmitButton disabled={loginMutation.isPending}>
              {loginMutation.isPending ? 'در حال ورود...' : 'ورود'}
            </SubmitButton>
          </>
        )}
        {step === 'register' && (
          <>
            <PhoneInputBox name="username" required placeholder="شماره تلفن" />
            {errors?.username && (
              <p className="text-red-500 text-sm whitespace-pre-line">
                {errors.username.join('\n')}
              </p>
            )}
            <InputBox name="email" required placeholder="ایمیل" />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.join('\n')}</p>
            )}
            <InputBox name="password" format="password" placeholder="رمزعبور" />
            {errors.password && (
              <p className="text-red-500 text-sm">
                {errors.password.join('\n')}
              </p>
            )}
            {errors.server && (
              <p className="text-red-500 text-sm">{errors.server.join('\n')}</p>
            )}
            <SubmitButton disabled={registerMutation.isPending}>
              {registerMutation.isPending ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
            </SubmitButton>
          </>
        )}
      </motion.form>
    </div>
  );
}
