'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { AiOutlineArrowRight } from 'react-icons/ai';

import { useLoginData } from '@/app/utils/states/useLoginData';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { checkUserExists } from '@/app/utils/data/getUserInfo';
import {
  signinAction,
  registerAction,
  setCookie,
} from '@/app/utils/actions/actionMethods';

import LoginForm from './LoginForm';
import PasswordForm from './PasswordForm';
import RegisterForm from './RegisterForm';

export default function AuthForm() {
  const { step, setStep, resetForm, identifier, setIdentifier } =
    useLoginData();
  const { setJwt, setLoginProcces } = useDataStore();
  const router = useRouter();
  const pathname = usePathname();

  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [isPending, setIsPending] = useState(false);

  const handleIdentifierSubmit = async (formData: FormData) => {
    const id = formData.get('identifier')?.toString() || '';
    setIdentifier(id);
    const result = await checkUserExists(id);
    if (!result.success) {
      setErrors({ identifier: ['کاربر یافت نشد. لطفاً ثبت‌نام کنید.'] });
      setStep('register');
    } else {
      setErrors({});
      setStep('login');
    }
  };

  const handleLoginSubmit = async (formData: FormData) => {
    setIsPending(true);
    setErrors({});
    const password = formData.get('password')?.toString() || '';
    try {
      const result = await signinAction(identifier, password);
      if (!result.success) {
        setErrors(result.fieldErrors || {});
        return;
      }
      setJwt(result.jwt);
      setLoginProcces(true);
      if (pathname.startsWith('/login')) router.push('/');
    } catch (err) {
      setErrors({ server: ['ورود ناموفق بود.'] });
    } finally {
      setIsPending(false);
    }
  };

  const handleRegisterSubmit = async (formData: FormData) => {
    setIsPending(true);
    setErrors({});
    try {
      const username = formData.get('username')?.toString() || '';
      const email = formData.get('email')?.toString() || '';
      const password = formData.get('password')?.toString() || '';

      const result = await registerAction(username, email, password);
      if (!result.success) {
        setErrors(result.fieldErrors || {});
        return;
      }
      await setCookie('jwt', `Bearer ${result.jwt}`);
      setJwt(result.jwt);
      setStep('login');
    } catch {
      setErrors({ server: ['ثبت‌نام ناموفق بود.'] });
    } finally {
      setIsPending(false);
    }
  };

  const stepTitles = {
    identifier: 'ورود یا ثبت‌نام',
    login: 'ورود به حساب',
    register: 'ثبت‌نام',
  };

  const stepLabels = ['ورود/ثبت‌نام', 'رمزعبور', 'ثبت‌نام'];
  const currentIndex = step === 'identifier' ? 0 : step === 'login' ? 1 : 2;

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
              onClick={() => setStep('identifier')}
              className="text-gray-500 hover:text-gray-700"
            >
              <AiOutlineArrowRight size={24} />
            </button>
          )}
          <h2 className="text-lg font-semibold text-gray-800">
            {stepTitles[step]}
          </h2>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-2 my-2">
          {stepLabels.map((label, index) => (
            <div key={label} className="flex items-center gap-1">
              <div
                className={`w-4 h-4 rounded-full transition-colors duration-300 ${index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
              />
              {index < stepLabels.length - 1 && (
                <div className="w-6 h-0.5 bg-gray-300" />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.form
            key={step}
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
          >
            {step === 'identifier' && (
              <LoginForm
                onSubmit={handleIdentifierSubmit}
                errors={errors} // Pass the full errors object
                isPending={isPending}
              />
            )}
            {step === 'login' && (
              <PasswordForm
                identifier={identifier} // Pass the identifier here
                onSubmit={handleLoginSubmit}
                errors={errors}
                isPending={isPending}
              />
            )}
            {step === 'register' && (
              <RegisterForm
                onSubmit={handleRegisterSubmit}
                errors={errors}
                isPending={isPending}
              />
            )}
          </motion.form>
        </AnimatePresence>

        <button
          type="button"
          onClick={resetForm}
          className="text-sm text-red-500 hover:underline mt-4 self-center"
        >
          شروع مجدد
        </button>
      </motion.div>
    </div>
  );
}
