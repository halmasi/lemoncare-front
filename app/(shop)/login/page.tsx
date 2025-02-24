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
import { loginSchema } from '@/app/utils/schema/formValidation';

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

  const checkUserExistence = async (enteredIdentifier: string) => {
    const { success } = await checkUserExists(enteredIdentifier);

    if (success) {
      setStep('login');
    } else {
      setStep('register');
    }
  };

  const loginMutation = useMutation({
    mutationFn: async ({
      identifier,
      password,
    }: {
      identifier: string;
      password: string;
    }) => {
      const response = await signinAction(identifier, password);
      console.log('loginMutation res : ', response);
      if (!response.success) {
        setErrors((prev) => ({
          ...prev,
          server: ['نام کاربری یا رمز عبور نادرست است'],
        }));
        throw new Error('نام کاربری یا رمز عبور نادرست است');
      }
      await setCookie('jwt', `Bearer ${response.jwt}`);
      setJwt(response.jwt);
      const userData = await getFullUserData();
      console.log('check sigin ', response);
      return { response, userData };
    },
    onSuccess: async (data) => {
      await setCookie('jwt', `Bearer ${data.response.jwt}`);
      setJwt(data.response.jwt);
      setUser(data.userData.body);
      queryClient.setQueryData(['user'], data.userData.body);
      router.push('/login/loading');
    },
    onError: (error) => {
      setErrors((prev) => ({ ...prev, server: [error.message] }));
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
        setErrors((prev) => ({ ...prev, server: ['ثبت‌نام ناموفق بود'] }));
        throw new Error('ثبت‌نام ناموفق بود');
      }
      await setCookie('jwt', `Bearer ${response.jwt}`);
      setJwt(response.jwt);
      return response;
    },
    onSuccess: async () => {
      setStep('login');
    },
    onError: (error) => {
      setErrors((prev) => ({ ...prev, server: [error.message] }));
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setErrors({
      identifier: [],
      password: [],
      server: [],
      username: [],
      email: [],
    });

    if (step === 'identifier') {
      const enteredIdentifier = formData.get('identifier')?.toString() || '';
      const result = await checkUserExists(enteredIdentifier);

      if (!result.success) {
        setStep('register');
      } else {
        setStep('login');
      }

      setIdentifier(enteredIdentifier);
      await checkUserExistence(enteredIdentifier);
    } else if (step === 'login') {
      console.log('step 2: ', step);
      loginMutation.mutate({
        identifier,
        password: formData.get('password')?.toString() || '',
      });
    } else {
      console.log('step 3: ', step);
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
              <p className="text-red-500 text-sm">{errors.identifier}</p>
            )}
            <SubmitButton>ادامه</SubmitButton>
          </>
        )}
        {step === 'login' && (
          <>
            <InputBox name="password" format="password" placeholder="رمزعبور" />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
            <SubmitButton disabled={loginMutation.isPending}>
              {loginMutation.isPending ? 'در حال ورود...' : 'ورود'}
            </SubmitButton>
          </>
        )}
        {step === 'register' && (
          <>
            <PhoneInputBox name="username" required placeholder="شماره تلفن" />
            <InputBox name="email" required placeholder="ایمیل" />
            <InputBox name="password" format="password" placeholder="رمزعبور" />
            {errors.server && (
              <p className="text-red-500 text-sm">{errors.server}</p>
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
