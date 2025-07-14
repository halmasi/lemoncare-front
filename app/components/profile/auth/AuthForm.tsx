'use client';

import { useLoginData } from '@/app/utils/states/useLoginData';
import { motion } from 'framer-motion';
import { AiOutlineArrowRight } from 'react-icons/ai';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ConfirmPhoneForm from './ConfirmPhoneForm';

export default function AuthForm() {
  const { step, setStep, resetForm, completedSteps } = useLoginData();

  const stepTitles = {
    identifier: 'ورود یا ثبت نام',
    login: 'ورود به حساب',
    register: 'ثبت نام',
    phoneConfirmationLogin: 'تایید شماره موبایل',
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
            <motion.div
              className={`w-3 h-3 rounded-full ${
                completedSteps.login
                  ? 'bg-green-500'
                  : step === 'phoneConfirmationLogin'
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
              }`}
              layout
            />
          </div>
        </div>

        {(step === 'identifier' || step === 'login') && <LoginForm />}
        {step === 'register' && <RegisterForm />}
        {step === 'phoneConfirmationLogin' && <ConfirmPhoneForm isLogin />}
        {step === 'phoneConfirmationRegister' && <ConfirmPhoneForm />}
      </div>
    </div>
  );
}
