'use client';

import { useLoginData } from '@/app/utils/states/useLoginData';
import { motion } from 'framer-motion';
import { AiOutlineArrowRight } from 'react-icons/ai';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ConfirmPhoneForm from './ConfirmPhoneForm';

export default function AuthForm() {
  const { step, setStep, resetForm } = useLoginData();

  const stepTitles = {
    identifier: 'ورود یا ثبت نام',
    login: 'ورود به حساب',
    register: 'ثبت نام',
    phoneConfirmationLogin: 'تایید شماره موبایل',
    phoneConfirmationLoginNoPhone: 'تایید شماره موبایل',
    phoneConfirmationRegister: 'تایید شماره موبایل',
  };

  return (
    <div className="flex w-full justify-center items-center">
      <div className="w-full bg-white p-6 rounded-2xl shadow-lg relative">
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
                step === 'identifier'
                  ? 'bg-accent-pink'
                  : step === 'register' ||
                      step === 'login' ||
                      step === 'phoneConfirmationLogin' ||
                      step === 'phoneConfirmationLoginNoPhone' ||
                      step === 'phoneConfirmationRegister'
                    ? 'bg-accent-pink/50'
                    : 'bg-gray-300'
              }`}
              layout
            />
            <motion.div
              className={`w-3 h-3 rounded-full ${
                step === 'register' || step === 'login'
                  ? 'bg-accent-pink'
                  : step === 'phoneConfirmationLogin' ||
                      step === 'phoneConfirmationRegister'
                    ? 'bg-accent-pink/50'
                    : 'bg-gray-300'
              }`}
              layout
            />
            <motion.div
              className={`w-3 h-3 rounded-full ${
                step === 'phoneConfirmationLogin' ||
                step === 'phoneConfirmationRegister'
                  ? 'bg-accent-pink'
                  : 'bg-gray-300'
              }`}
              layout
            />
          </div>
        </div>

        {(step === 'identifier' || step === 'login') && <LoginForm />}
        {step === 'register' && <RegisterForm />}
        {step === 'phoneConfirmationLogin' && <ConfirmPhoneForm isLogin />}
        {step === 'phoneConfirmationLoginNoPhone' && (
          <ConfirmPhoneForm isLogin isNoPhone />
        )}
        {step === 'phoneConfirmationRegister' && (
          <ConfirmPhoneForm isRegister />
        )}
      </div>
    </div>
  );
}
