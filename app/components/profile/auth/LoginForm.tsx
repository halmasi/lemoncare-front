'use client';
import { useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { checkUserExists } from '@/app/utils/data/getUserInfo';
import InputBox from '@/app/components/formElements/InputBox';
import SubmitButton from '@/app/components/formElements/SubmitButton';
import { isPhone } from '@/app/utils/miniFunctions';
import { useLoginData } from '@/app/utils/states/useLoginData';

interface LoginFormProps {
  identifier: string; // Add this line
  onSubmit: (formData: FormData) => Promise<void>;
  errors?: { [key: string]: string[] };
  isPending: boolean;
}

export default function LoginForm({
  onSubmit,
  errors,
  isPending,
}: LoginFormProps) {
  const identifierRef = useRef<HTMLInputElement>(null);
  const { setEmail, setUsername, setStep, setErrors } = useLoginData();

  const loginCheck = useMutation({
    mutationFn: async (identifier: string) => {
      const result = await checkUserExists(identifier);
      if (!result.success) {
        // Update errors in the store
        setErrors({
          identifier: result.error,
          username: [],
          password: [],
          email: [],
          server: [],
        });
        throw new Error();
      }
      return identifier;
    },
    onSuccess(identifier) {
      if (isPhone(identifier)) setUsername(identifier);
      else setEmail(identifier);
      setStep('login');
    },
    onError() {},
  });

  const identifierErrors = errors?.identifier;

  return (
    <>
      <InputBox
        ref={identifierRef}
        name="identifier"
        placeholder="ایمیل یا شماره تلفن"
      />
      {identifierErrors && identifierErrors.length > 0 && (
        <p className="text-red-500 text-sm whitespace-pre-line">
          {identifierErrors.join('\n')}
        </p>
      )}
      <SubmitButton
        isPending={isPending}
        onClick={() => {
          loginCheck.mutateAsync(identifierRef.current!.value);
        }}
      >
        ادامه
      </SubmitButton>
    </>
  );
}
LoginForm.displayName = 'LoginForm';
