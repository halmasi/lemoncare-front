import AuthForm from '@/app/components/profile/auth/AuthForm';
import React from 'react';

export default function AuthPage() {
  return (
    <div className="flex w-full md:w-3/12 min-h-svh items-center justify-center">
      <AuthForm />
    </div>
  );
}
