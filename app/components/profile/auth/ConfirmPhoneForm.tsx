'use client';

import { useLoginData } from '@/app/utils/states/useLoginData';
import InputBox from '@/app/components/formElements/InputBox';
import { useEffect, useRef, useState } from 'react';
import SubmitButton from '../../formElements/SubmitButton';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { BiEditAlt } from 'react-icons/bi';
import { useDataStore } from '@/app/utils/states/useUserdata';
import {
  getFullUserData,
  removeUser,
  setCookie,
} from '@/app/utils/actions/actionMethods';
import { usePathname, useRouter } from 'next/navigation';
import { updateUserInformation } from '@/app/utils/data/getUserInfo';
import { sendCode, validateCode } from '@/app/utils/data/getValidation';
import { cleanPhone } from '@/app/utils/miniFunctions';

export default function ConfirmPhoneForm({
  isLogin = false,
  isRegister = false,
  isNoPhone = false,
}: {
  isLogin?: boolean;
  isRegister?: boolean;
  isNoPhone?: boolean;
}) {
  const codeRef = useRef<HTMLInputElement>(null);

  const [timer, setTimer] = useState<number>(120);
  const [resend, setResend] = useState<boolean>(true);

  const router = useRouter();
  const path = usePathname();

  const { username, setStep, id } = useLoginData();
  const { setJwt, setUser, setLoginProcces, user } = useDataStore();

  const sendCodeFn = useMutation({
    mutationFn: async (phone: string) => {
      setResend(true);
      return await sendCode(phone);
    },
    onSuccess: async (data) => {
      setResend(false);
      if (data.status >= 400 && data.status < 500) {
        setTimer(Math.abs(Math.floor(parseInt(data.result.result))));
        toast.warn(
          `پس از ${Math.floor(parseInt(data.result.result))} ثانیه، ارسال مجدد کد امکان پذیر است.`
        );
      } else {
        toast.info('کد فعال سازی به شماره شما پیامک شد.');
        setTimer(120);
      }
    },
    onError: (err) => {
      console.log(err);
      toast.error('خطا در ارسال کد فعال سازی. لطفا دوباره تلاش کنید.');
      setTimer(0);
      setResend(false);
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
      return await validateCode({ username, code });
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
      toast.info('شماره همراه شما تایید شد.');
      setLoginProcces(true);
      if (path.startsWith('/login')) router.push('/');
    },
    retry: 5,
    retryDelay: 2000,
  });

  const deleteUserFn = useMutation({
    mutationFn: async (id: number) => {
      const res = await removeUser(id);
      return res;
    },
    onSuccess: () => {},
  });

  useEffect(() => {
    if (timer) {
      setTimeout(() => setTimer(timer - 1), 1000);
    } else setResend(false);
  }, [timer, setTimer]);

  useEffect(() => {
    if (username) {
      sendCodeFn.mutate(username);
    } else if (user && user.username) sendCodeFn.mutate(user?.username);
  }, [username, user]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const enteredCode = codeRef.current?.value || '';

    verifyCodeFn.mutate({
      code: parseInt(enteredCode),
      username: username ? username : user?.username || '',
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
                deleteUserFn.mutate(id);
                setStep('register');
              }
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <BiEditAlt />
            {isNoPhone ? (
              <span>
                <span>{cleanPhone(username).slice(-2)}</span>
                <span>*****</span>
                <span>0{cleanPhone(username).slice(0, 3)}</span>
              </span>
            ) : (
              <span>
                0
                {username
                  ? cleanPhone(username)
                  : cleanPhone(user?.username || '')}
              </span>
            )}
          </span>
          کد فعال سازی
        </span>
      </InputBox>
      <div className="w-full flex justify-around gap-5">
        <SubmitButton
          isPending={verifyCodeFn.isPending}
          disabled={verifyCodeFn.isPending}
          type="submit"
          className="w-full"
        >
          تایید
        </SubmitButton>
        <SubmitButton
          disabled={timer > 0 || resend}
          isPending={timer > 0 || resend}
          type="button"
          className="w-full bg-gray-200 hover:bg-gray-100 hover:text-black"
          onClick={() => {
            if (username) sendCodeFn.mutate('98' + username);
            else if (user?.username) sendCodeFn.mutate(user?.username);
          }}
        >
          {timer > 0 ? `${timer} ثانیه` : 'ارسال مجدد'}
        </SubmitButton>
      </div>
    </form>
  );
}
