'use client';

import { useRef, useEffect } from 'react';
import PhoneInputBox from '@/app/components/formElements/PhoneInputBox';
import InputBox from '@/app/components/formElements/InputBox';
import SubmitButton from '@/app/components/formElements/SubmitButton';
import { useLoginData } from '@/app/utils/states/useLoginData';
import { useMutation } from '@tanstack/react-query';
import { registerAction } from '@/app/utils/actions/actionMethods';
import { registerSchema } from '@/app/utils/schema/formValidation';
import { isPhone } from '@/app/utils/miniFunctions';

export default function RegisterForm() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const {
    setStep,
    setErrors,
    email,
    username,
    errors,
    setEmail,
    setUsername,
    setId,
  } = useLoginData();

  useEffect(() => {
    usernameRef.current!.value = username;
    emailRef.current!.value = email;
  }, [email, username]);

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
        throw new Error('ایمیل یا شماره موبایل تکراری است.');
      }
      setUsername(username);
      setEmail(email);
      return response.user;
    },
    onSuccess: (data) => {
      setId(data);
      setStep('phoneConfirmationRegister');
    },
    onError: (error: Error) => {
      setErrors({
        identifier: [],
        username: [error.message],
        password: [],
        email: [],
        server: [],
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const enteredUsername = usernameRef.current?.value || '';
    const enteredEmail = emailRef.current?.value || '';
    const enteredPassword = passwordRef.current?.value || '';

    // Determine if the identifier is a phone number or email
    const isPhoneNumber = isPhone(enteredUsername);
    const username = isPhoneNumber ? enteredUsername : '';
    const email = isPhoneNumber ? enteredEmail : enteredUsername;

    // Validate the form using the schema
    const validationResult = registerSchema.safeParse({
      username: '98' + username,
      email,
      password: enteredPassword,
    });

    if (!validationResult.success) {
      const validationErrors = validationResult.error.flatten().fieldErrors;
      setErrors({
        username: validationErrors.username || [],
        email: validationErrors.email || [],
        password: validationErrors.password || [],
        identifier: [],
        server: [],
      });
      return;
    }

    registerMutation.mutate({
      username,
      email,
      password: enteredPassword,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PhoneInputBox
        ref={usernameRef}
        name="username"
        placeholder="شماره تلفن "
        required
      />
      <InputBox ref={emailRef} name="email" placeholder="ایمیل" required ltr />
      <InputBox
        ref={passwordRef}
        name="password"
        type="password"
        ltr
        placeholder="رمزعبور"
        required
      />
      {errors.username && (
        <p className="text-red-500 text-sm">{errors.username.join('\n')}</p>
      )}
      {errors.email && (
        <p className="text-red-500 text-sm">{errors.email.join('\n')}</p>
      )}
      {errors.password && (
        <p className="text-red-500 text-sm">{errors.password.join('\n')}</p>
      )}
      <SubmitButton isPending={registerMutation.isPending}>
        {registerMutation.isPending ? 'در حال ثبت نام...' : 'ثبت نام'}
      </SubmitButton>
    </form>
  );
}
