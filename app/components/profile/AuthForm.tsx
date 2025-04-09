'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useDataStore } from '@/app/utils/states/useUserdata';
import InputBox from '@/app/components/formElements/InputBox';
import SubmitButton from '@/app/components/formElements/SubmitButton';
import PhoneInputBox from '@/app/components/formElements/PhoneInputBox';
import {
  signinAction,
  registerAction,
  setCookie,
  checkUserExists,
} from '@/app/utils/actions/actionMethods';
import { motion, AnimatePresence } from 'framer-motion';
import { AiOutlineArrowRight } from 'react-icons/ai';
export default function AuthForm() {
  const usePath = usePathname();
  const router = useRouter();

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
  const { setJwt, setLoginProcces } = useDataStore();

  const loginMutation = useMutation({
    mutationFn: async ({
      identifier,
      password,
    }: {
      identifier: string;
      password: string;
    }) => {
      setLoginProcces(false);
      const response = await signinAction(identifier, password);
      if (!response.success) {
        setErrors((prev) => ({ ...prev, ...response.fieldErrors }));
        throw new Error();
      }
      return response;
    },
    onSuccess: async (data) => {
      if (!data) return;
      setJwt(data.jwt);
      if (usePath.startsWith('/login')) router.push('/');
      setLoginProcces(true);
    },
    onError: () => {
      setLoginProcces(false); // Ensure login process is reset on error
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
      loginMutation.mutateAsync({
        identifier,
        password: formData.get('password')?.toString() || '',
      });
    } else if (step === 'register') {
      registerMutation.mutateAsync({
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
    <div className="flex w-full justify-center items-center">
      <motion.div
        className="w-full bg-white p-6 rounded-2xl shadow-lg relative"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-4">
          {step !== 'identifier' && (
            <button
              onClick={() => {
                setStep('identifier');
                setErrors({});
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <AiOutlineArrowRight size={24} />
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
                <InputBox
                  name="password"
                  format="password"
                  placeholder="رمزعبور"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.join('\n.\n')}
                  </p>
                )}
                {errors.server && (
                  <p className="text-red-500 text-sm">
                    {errors.server.join('\n')}
                  </p>
                )}
                <SubmitButton isPending={loginMutation.isPending}>
                  {loginMutation.isPending ? 'در حال ورود...' : 'ورود'}
                </SubmitButton>
              </>
            )}
            {step === 'register' && (
              <>
                <PhoneInputBox
                  name="username"
                  value={
                    /^(\+98|98|0)?9\d{9}$/.test(identifier) ? identifier : ' '
                  }
                  required
                  placeholder="شماره تلفن"
                />
                {errors?.username && (
                  <p className="text-red-500 text-sm whitespace-pre-line">
                    {errors.username.join('\n')}
                  </p>
                )}
                <InputBox name="email" required placeholder="ایمیل" />
                {errors.email && (
                  <p className="text-red-500 text-sm">
                    {errors.email.join('\n')}
                  </p>
                )}
                <InputBox
                  name="password"
                  format="password"
                  placeholder="رمزعبور"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.join('\n')}
                  </p>
                )}
                {errors.server && (
                  <p className="text-red-500 text-sm">
                    {errors.server.join('\n')}
                  </p>
                )}
                <SubmitButton isPending={registerMutation.isPending}>
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
