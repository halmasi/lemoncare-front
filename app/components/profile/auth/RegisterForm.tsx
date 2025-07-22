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
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordValidateRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const { setStep, setErrors, username, errors, setUsername, setId } =
    useLoginData();

  useEffect(() => {
    usernameRef.current!.value = username;
  }, [username]);

  const registerMutation = useMutation({
    mutationFn: async ({
      username,
      password,
      name,
    }: {
      username: string;
      password: string;
      name: string;
    }) => {
      const response = await registerAction({ username, password, name });
      if (!response.success) {
        throw new Error('شماره موبایل تکراری است.');
      }
      setUsername(username);
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
        name: [],
        server: [],
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const enteredUsername = usernameRef.current?.value || '';
    const enteredName = nameRef.current?.value || '';
    const enteredPassword = passwordRef.current?.value || '';
    const passwordValidation = passwordValidateRef.current?.value || '';
    if (enteredPassword != passwordValidation) {
      setErrors({
        ...errors,
        password: ['رمزعبور و تایید رمزعبور یکسان نیستند.'],
      });
      return;
    }
    // Determine if the identifier is a phone number or email
    const isPhoneNumber = isPhone(enteredUsername);
    const username = isPhoneNumber ? enteredUsername : '';
    // const email = isPhoneNumber ? enteredEmail : enteredUsername;

    // Validate the form using the schema
    const validationResult = registerSchema.safeParse({
      username: '98' + username,
      name: enteredName,
      password: enteredPassword,
    });

    if (!validationResult.success) {
      const validationErrors = validationResult.error.flatten().fieldErrors;
      setErrors({
        username: validationErrors.username || [],
        name: validationErrors.name || [],
        password: validationErrors.password || [],
        identifier: [],
        server: [],
      });
      return;
    }

    registerMutation.mutate({
      username,
      name: enteredName,
      password: enteredPassword,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PhoneInputBox
        ref={usernameRef}
        name="username"
        placeholder="شماره همراه "
        required
      >
        شماره همراه
      </PhoneInputBox>
      {errors.username && (
        <p className="text-red-500 text-sm">{errors.username.join('\n')}</p>
      )}
      <InputBox
        ref={passwordRef}
        name="password"
        type="password"
        showEye={false}
        ltr
        placeholder="رمزعبور"
        required
      >
        رمز عبور
      </InputBox>
      {errors.password && (
        <p className="text-red-500 text-sm">{errors.password.join('\n')}</p>
      )}
      <InputBox
        ref={passwordValidateRef}
        name="passwordValidate"
        type="password"
        showEye={false}
        ltr
        placeholder="تایید رمزعبور"
        required
      >
        تایید رمز عبور
      </InputBox>
      <InputBox ref={nameRef} name="name" placeholder="نام کامل" required>
        نام
      </InputBox>
      {errors.name && (
        <p className="text-red-500 text-sm">{errors.name.join('\n')}</p>
      )}
      <SubmitButton isPending={registerMutation.isPending}>
        {registerMutation.isPending ? 'در حال ثبت نام...' : 'ثبت نام'}
      </SubmitButton>
    </form>
  );
}
