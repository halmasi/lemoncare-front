'use client';

import { useLoginData } from '@/app/utils/states/useLoginData';
import InputBox from '@/app/components/formElements/InputBox';
import { useEffect, useRef } from 'react';
import SubmitButton from '../../formElements/SubmitButton';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { BiEditAlt } from 'react-icons/bi';
import { useDataStore } from '@/app/utils/states/useUserdata';
import {
  getFullUserData,
  registerAction,
  removeUser,
  setCookie,
} from '@/app/utils/actions/actionMethods';
import { usePathname, useRouter } from 'next/navigation';
import { updateUserInformation } from '@/app/utils/data/getUserInfo';

export default function ConfirmPhoneForm({
  isLogin = false,
  isRegister = false,
}: {
  isLogin?: boolean;
  isRegister?: boolean;
}) {
  const codeRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const path = usePathname();

  const { username, setStep, id } = useLoginData();
  const { setJwt, setUser, setLoginProcces } = useDataStore();

  const sendCodeFn = useMutation({
    mutationFn: async (phone: string) => {
      return await fetch('api/auth/oneTimePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: phone,
        }),
      });
    },
    onSuccess: async (data) => {
      const res = await data.json();
      const result = JSON.parse(res);
      if (data.status >= 400 && data.status < 500) {
        toast.warn(
          `پس از ${Math.floor(parseInt(result.result))} ثانیه، ارسال مجدد کد امکان پذیر است.`
        );
      } else toast.info('کد فعال سازی به شماره شما پیامک شد.');
    },
    onError: () => {
      toast.error('خطا در ارسال کد فعال سازی. لطفا دوباره تلاش کنید.');
    },
  });

  const verifyCodeFn = useMutation({
    mutationFn: async ({
      code,
      username,
    }: {
      code: number;
      username: string;
    }) => {
      const res = await fetch('api/auth/oneTimePassword/validateCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          code,
        }),
      });
      const data = await res.json();
      return JSON.parse(data);
    },
    onSuccess: async (data) => {
      if (!data || !data.jwt)
        return toast.error('خطا در تایید کد فعال سازی. لطفا دوباره تلاش کنید.');
      const userData = await getFullUserData({ token: `Bearer ${data.jwt}` });
      await updateUserInformation(userData.body.id, `Bearer ${data.jwt}`, {
        phoneConfirmed: true,
      });
      setUser({ ...userData.body, phoneConfirmed: true });
      setJwt(`Bearer ${data.jwt}`);
      await setCookie('jwt', `Bearer ${data.jwt}`);
      setLoginProcces(true);
      if (path.startsWith('/login')) router.push('/');
    },
  });

  const deleteUserFn = useMutation({
    mutationFn: async (id: number) => {
      const res = await removeUser(id);
      return res;
    },
    onSuccess: (data) => {
      console.log(data);
    },
  });

  useEffect(() => {
    if (username) {
      sendCodeFn.mutate('98' + username);
    }
  }, [username]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const enteredCode = codeRef.current?.value || '';
    verifyCodeFn.mutateAsync({
      code: parseInt(enteredCode),
      username: '98' + username,
    });
  };

  return (
    <form className="w-full flex flex-col space-y-4" onSubmit={handleSubmit}>
      <InputBox
        flex="col"
        ltr
        name="کد فعال سازی"
        className="flex flex-col"
        ref={codeRef}
        onChange={(e) => {
          const value = e.target.value.replace(/[^0-9]/g, '');
          e.target.value = value;
          if (value.length > 6) {
            e.target.value = value.slice(0, 6);
          }
        }}
      >
        <span>
          <span
            onClick={() => {
              if (isLogin) setStep('identifier');
              else if (isRegister) {
                deleteUserFn.mutateAsync(id);
                setStep('register');
              }
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <BiEditAlt />0{username}
          </span>
          کد فعال سازی
        </span>
      </InputBox>
      <div className="w-full flex justify-around gap-5">
        <SubmitButton type="submit" className="w-full">
          تایید
        </SubmitButton>
        <SubmitButton
          type="button"
          className="w-full bg-red-500 hover:bg-red-400"
          onClick={() => {
            sendCodeFn.mutate('98' + username);
          }}
        >
          ارسال مجدد
        </SubmitButton>
      </div>
    </form>
  );
}
