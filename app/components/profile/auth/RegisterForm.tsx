'use client';
import PhoneInputBox from '@/app/components/formElements/PhoneInputBox';
import InputBox from '@/app/components/formElements/InputBox';
import SubmitButton from '@/app/components/formElements/SubmitButton';
import { useMutation } from '@tanstack/react-query';
import { registerAction, setCookie } from '@/app/utils/actions/actionMethods';
import { useLoginData } from '@/app/utils/states/useLoginData';
import { useDataStore } from '@/app/utils/states/useUserdata';

export default function RegisterForm() {
  const { setErrors, errors, setUsername, setEmail, setStep } = useLoginData();
  const { setJwt } = useDataStore();

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
        setErrors({
          ...errors,
          ...response.fieldErrors,
        });
        throw new Error();
      }
      await setCookie('jwt', `Bearer ${response.jwt}`);
      setJwt(response.jwt);
      return response.jwt;
    },
    onSuccess() {
      setStep('login');
    },
  });

  const handleRegister = () => {
    const form = document.querySelector('form')!;
    const formData = new FormData(form);
    const username = formData.get('username')?.toString() || '';
    const email = formData.get('email')?.toString() || '';
    const password = formData.get('password')?.toString() || '';
    setUsername(username);
    setEmail(email);

    registerMutation.mutate({ username, email, password });
  };

  return (
    <>
      <PhoneInputBox name="username" required placeholder="شماره تلفن" />
      {errors.username?.length > 0 && (
        <p className="text-red-500 text-sm whitespace-pre-line">
          {errors.username.join('\n')}
        </p>
      )}
      <InputBox name="email" required placeholder="ایمیل" />
      {errors.email?.length > 0 && (
        <p className="text-red-500 text-sm whitespace-pre-line">
          {errors.email.join('\n')}
        </p>
      )}
      <InputBox name="password" type="password" placeholder="رمزعبور" />
      {errors.password?.length > 0 && (
        <p className="text-red-500 text-sm whitespace-pre-line">
          {errors.password.join('\n')}
        </p>
      )}
      {errors.server?.length > 0 && (
        <p className="text-red-500 text-sm whitespace-pre-line">
          {errors.server.join('\n')}
        </p>
      )}
      <SubmitButton
        isPending={registerMutation.isPending}
        onClick={handleRegister}
      >
        {registerMutation.isPending ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
      </SubmitButton>
    </>
  );
}
