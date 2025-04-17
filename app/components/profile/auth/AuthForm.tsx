'use client';

import { useLoginData } from '@/app/utils/states/useLoginData';
import { motion, AnimatePresence } from 'framer-motion';
import { AiOutlineArrowRight } from 'react-icons/ai';
import LoginForm from './LoginForm';
import PasswordForm from './PasswordForm';
import RegisterForm from './RegisterForm';

export default function AuthForm() {
  const { step, setStep, resetForm, errors, completedSteps } = useLoginData();

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
                resetForm();
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
          <motion.div
            key={step}
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
          >
            {step === 'identifier' && <LoginForm />}
            {step === 'login' && <PasswordForm />}
            {step === 'register' && <RegisterForm />}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
