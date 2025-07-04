'use client';

import InputBox from '@/app/components/formElements/InputBox';
import PhoneInputBox from '@/app/components/formElements/PhoneInputBox';
import SubmitButton from '@/app/components/formElements/SubmitButton';
import { updateUserInformation } from '@/app/utils/data/getUserInfo';
import { logs } from '@/app/utils/miniFunctions';
import { cleanPhone } from '@/app/utils/miniFunctions';
import { updateUserInformationSchema } from '@/app/utils/schema/formValidation';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

export default function Information() {
  const { user, jwt } = useDataStore();
  const queryClient = useQueryClient();

  const router = useRouter();

  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      if (user.fullName) {
        fullNameRef.current!.value = user.fullName;
      }
      if (user.username?.length) {
        usernameRef.current!.value = user.username.slice(2);
      }
      if (user.email) {
        emailRef.current!.value = user.email;
      }
    }
  }, [user]);

  const editUserInformaion = useMutation({
    mutationFn: async (inputUserData: {
      fullName?: string;
      username?: string;
      email?: string;
    }) => {
      if (user && user.id && jwt) {
        const response = await updateUserInformation(
          user.id,
          jwt,
          inputUserData
        );
        if (!response) {
          toast.error('پاسخی از سرور دریافت نشد');
        }
        return response;
      } else {
        logs.error('error document id ');
        return;
      }
    },
    onSuccess: async () => {
      if (user) queryClient.setQueryData(['user'], user.data);
      router.push('/dashboard/information');
    },
    onError: (error: string) => {
      logs.error('onError: ' + error);
    },
  });
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const inputUserData = {
      fullName: formData.get('fullName')?.toString() || '',
      username: cleanPhone(formData.get('username')?.toString() || ''),
      email: formData.get('email')?.toString() || '',
    };
    const validation = updateUserInformationSchema.safeParse(inputUserData);
    if (!validation.success) {
      console.error(validation.error.format());
      return;
    }
    editUserInformaion.mutate(inputUserData);
  };
  return (
    <>
      <form className="flex flex-col w-5/12" onSubmit={handleSubmit}>
        <PhoneInputBox
          name="username"
          placeholder="شماره تلفن"
          ref={usernameRef}
        >
          شماره تلفن
        </PhoneInputBox>
        <InputBox name="fullName" placeholder="نام کامل" ref={fullNameRef}>
          نام کامل
        </InputBox>
        <InputBox name="email" placeholder="آدرس ایمیل" ref={emailRef}>
          آدرس ایمیل
        </InputBox>
        <SubmitButton disabled={editUserInformaion.isPending}>
          {editUserInformaion.isPending ? 'در حال ذخیره...' : 'ثبت'}
        </SubmitButton>
      </form>
    </>
  );
}
