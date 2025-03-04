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
import { motion, AnimatePresence } from 'framer-motion';
import { AiOutlineArrowLeft } from 'react-icons/ai';

export default function AuthForm() {
  const [step, setStep] = useState<'identifier' | 'login' | 'register'>(
    'identifier'
  );
  const [identifier, setIdentifier] = useState('');
  const [completedSteps, setCompletedSteps] = useState<{
    identifier: boolean;
    login: boolean;
    register: boolean;
  }>({
    identifier: false,
    login: false,
    register: false,
  });
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
      if (!data) return;
      setCompletedSteps((prev) => ({ ...prev, login: true }));
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
    onSuccess: async () => {
      setCompletedSteps((prev) => ({ ...prev, register: true }));
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
      if (result.success) {
        setCompletedSteps((prev) => ({ ...prev, identifier: true }));
      }
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

  const stepTitles = {
    identifier: 'ورود یا ثبت‌نام',
    login: 'ورود به حساب',
    register: 'ثبت‌نام',
  };

  return (
    <div className="flex w-full justify-center items-center h-screen bg-gray-100">
      <motion.div
        className="w-full md:w-3/12 bg-white p-6 rounded-2xl shadow-lg relative"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-4">
          {step !== 'identifier' && (
            <button
              onClick={() => setStep('identifier')}
              className="text-gray-500 hover:text-gray-700"
            >
              <AiOutlineArrowLeft size={24} />
            </button>
          )}
          <h2 className="text-lg font-semibold text-gray-800">
            {stepTitles[step]}
          </h2>
          <div className="flex gap-2">
            <motion.div
              className={`w-3 h-3 rounded-full ${
                completedSteps.identifier
                  ? 'bg-green-500'
                  : step === 'identifier'
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
              }`}
              layout
            />
            <motion.div
              className={`w-3 h-3 rounded-full ${
                completedSteps.login
                  ? 'bg-green-500'
                  : step === 'login'
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
              }`}
              layout
            />
            <motion.div
              className={`w-3 h-3 rounded-full ${
                completedSteps.register
                  ? 'bg-green-500'
                  : step === 'register'
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
              }`}
              layout
            />
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.form
            key={step}
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
          >
            {step === 'identifier' && (
              <>
                <InputBox name="identifier" placeholder="ایمیل یا شماره تلفن" />
                <SubmitButton>ادامه</SubmitButton>
              </>
            )}
            {step === 'login' && (
              <>
                <InputBox
                  name="password"
                  format="password"
                  placeholder="رمزعبور"
                />
                <SubmitButton disabled={loginMutation.isPending}>
                  {loginMutation.isPending ? 'در حال ورود...' : 'ورود'}
                </SubmitButton>
              </>
            )}
            {step === 'register' && (
              <>
                <PhoneInputBox
                  name="username"
                  required
                  placeholder="شماره تلفن"
                />
                <InputBox name="email" required placeholder="ایمیل" />
                <InputBox
                  name="password"
                  format="password"
                  placeholder="رمزعبور"
                />
                <SubmitButton disabled={registerMutation.isPending}>
                  {registerMutation.isPending ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
                </SubmitButton>
              </>
            )}
          </motion.form>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
