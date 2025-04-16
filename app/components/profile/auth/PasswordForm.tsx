'use client';
import InputBox from '@/app/components/formElements/InputBox';
import SubmitButton from '@/app/components/formElements/SubmitButton';
import { useLoginData } from '@/app/utils/states/useLoginData';
import { useMutation } from '@tanstack/react-query';
import { signinAction, setCookie } from '@/app/utils/actions/actionMethods';
import { useRouter } from 'next/navigation';
import { useDataStore } from '@/app/utils/states/useUserdata';

export default function PasswordForm() {
  const { username, email, errors, setErrors, setStep } = useLoginData();
  const { setJwt, setLoginProcces } = useDataStore();
  const router = useRouter();

  const identifier = username || email;

  const loginMutation = useMutation({
    mutationFn: async (password: string) => {
      setLoginProcces(false);
      const response = await signinAction(identifier, password);
      if (!response.success) {
        setErrors({
          ...errors,
          ...response.fieldErrors,
        });
        throw new Error();
      }
      await setCookie('jwt', `Bearer ${response.jwt}`);
      return response.jwt;
    },
    onSuccess(jwt) {
      setJwt(jwt);
      setLoginProcces(true);
      router.push('/');
    },
    onError() {
      setLoginProcces(false);
    },
  });

  return (
    <>
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
        isPending={loginMutation.isPending}
        onClick={() => {
          const passwordInput = document.querySelector<HTMLInputElement>(
            'input[name="password"]'
          );
          loginMutation.mutate(passwordInput?.value || '');
        }}
      >
        {loginMutation.isPending ? 'در حال ورود...' : 'ورود'}
      </SubmitButton>
    </>
  );
}
