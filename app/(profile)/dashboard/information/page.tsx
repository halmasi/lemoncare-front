'use client';

import InputBox from '@/app/components/formElements/InputBox';
import PhoneInputBox from '@/app/components/formElements/PhoneInputBox';
import SubmitButton from '@/app/components/formElements/SubmitButton';
import { getFullUserData } from '@/app/utils/actions/actionMethods';
import {
  changePassword,
  checkUserExists,
  updateUserInformation,
} from '@/app/utils/data/getUserInfo';
import { logs } from '@/app/utils/miniFunctions';
import { cleanPhone } from '@/app/utils/miniFunctions';
import { updateUserInformationSchema } from '@/app/utils/schema/formValidation';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { useMutation } from '@tanstack/react-query';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import ConfirmPhoneForm from '@/app/components/profile/auth/ConfirmPhoneForm';
import Title from '@/app/components/Title';
import Link from 'next/link';
import { FaArrowRightLong } from 'react-icons/fa6';

export default function Information() {
  const { user, jwt, setUser } = useDataStore();

  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const validatePasswordRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<{
    password: string;
    validatePassword: string;
    username: string;
    email: string;
    fullname: string;
  }>({
    password: '',
    validatePassword: '',
    username: '',
    email: '',
    fullname: '',
  });
  const [usernameChange, setUsernameChange] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      if (user.fullName) {
        fullNameRef.current!.value = user.fullName;
      }
      if (user.username?.length) {
        usernameRef.current!.value = user.username.slice(2);
      }
      if (user.email && user.email != `${user.username}@lemiro.ir`) {
        emailRef.current!.value = user.email;
      }
    }
  }, [user]);

  const getUserInfoFn = useMutation({
    mutationFn: async () => {
      const userData = await getFullUserData();
      return userData;
    },
    onSuccess: (data) => {
      setUser(data.body);
    },
  });

  const editUserInformaion = useMutation({
    mutationFn: async (inputUserData: {
      fullName?: string;
      username?: string;
      email?: string;
      phoneConfirmed?: boolean;
      confirmed?: boolean;
      password?: string;
    }) => {
      if (inputUserData.username) inputUserData.phoneConfirmed = false;
      if (inputUserData.email) inputUserData.confirmed = false;

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
      setUsernameChange(false);
      toast.success('تغییرات با موفقیت اعمال شد.');
      getUserInfoFn.mutate();
    },
    onError: (error: string) => {
      logs.error('onError: ' + error);
    },
  });

  const changePasswordFn = useMutation({
    mutationFn: async (newPassword: string) => {
      if (jwt)
        return await changePassword({
          newPassword,
          token: jwt,
        });
    },
    onSuccess: (data) => {
      if (!data || data.status >= 300 || data.status < 200)
        throw new Error('تغییر رمز عبور موفقیت آمیز نبود');
      toast.success('تغییرات با موفقیت اعمال شد.');
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const checkEmailAndUsernameFn = useMutation({
    mutationFn: async ({
      userName,
      type,
    }: {
      userName: string;
      type: 'email' | 'username';
    }) => {
      const res = await checkUserExists(userName);
      return { data: res, type, userName };
    },
    onSuccess: ({ data, type, userName }) => {
      if (data.error.length) throw new Error('خطا در دریافت اطلاعات');
      if (data.success) {
        if (type == 'email')
          setErrors({
            ...errors,
            email: 'ایمیل توسط کاربر دیگری مورد استفاده قرار گرفته است.',
          });
        if (type == 'username')
          setErrors({
            ...errors,
            email: 'شماره موبایل توسط کاربر دیگری مورد استفاده قرار گرفته است.',
          });
        throw new Error(
          `${type == 'email' ? 'ایمیل' : 'شماره موبایل'} توسط کاربر دیگری مورد استفاده قرار گرفته است.`
        );
      }
      if (type == 'email')
        editUserInformaion.mutate({
          email: userName,
        });
      else
        editUserInformaion.mutate({
          username: userName,
        });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    let username = formData.get('username')?.toString();
    if (username) {
      username = '98' + cleanPhone(username);
    }
    const email = formData.get('email')?.toString() || '';
    const fullName = formData.get('fullName')?.toString() || '';
    const password = formData.get('password')?.toString() || '';
    const confirmPassword = formData.get('validatePassword')?.toString() || '';

    const validation = updateUserInformationSchema.safeParse({
      username,
      email,
      fullName,
      password,
    });

    if (!validation.success) {
      console.error(validation.error.format());
      return;
    }
    if (username && username != '' && username != user?.username) {
      checkEmailAndUsernameFn.mutate({
        type: 'username',
        userName: username,
      });
    }
    if (email && email != '' && email != user?.email) {
      toast.warn('پس از تغییر آدرس ایمیل، ایمیل ارسال شده را تایید کنید.');
      checkEmailAndUsernameFn.mutate({
        type: 'email',
        userName: email,
      });
    }
    if (fullName && fullName != '' && fullName != user?.fullName) {
      editUserInformaion.mutate({ fullName });
    }
    if (
      password &&
      password != '' &&
      confirmPassword &&
      password == confirmPassword
    ) {
      changePasswordFn.mutate(password);
    }
  };
  return (
    <div className="w-full flex flex-col max-w-screen-md">
      <div className="flex flex-col md:flex-row w-full">
        <Link
          href={'/dashboard'}
          className="absolute hover:text-accent-pink self-start md:self-center md:justify-self-start transition-colors w-fit p-2 border-l"
        >
          <FaArrowRightLong />
        </Link>
        <div className="w-full flex flex-col items-center justify-center text-center mb-5">
          <Title className="flex flex-col items-center justify-center text-center mb-6">
            <h6 className="text-accent-pink">ویرایش اطلاعات من</h6>
          </Title>
        </div>
      </div>

      <form className="w-full flex flex-col p-5 gap-4 " onSubmit={handleSubmit}>
        <PhoneInputBox
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setUsernameChange(true);
            if (
              /^9\d{9}$/.test(e.currentTarget.value) ||
              /^09\d{9}$/.test(e.currentTarget.value)
            ) {
              setErrors({ ...errors, username: '' });
            } else
              setErrors({
                ...errors,
                username: 'فرمت شماره تماس باید به این شکل باشد: 09121234567',
              });
          }}
          name="username"
          placeholder="شماره تلفن"
          ref={usernameRef}
        >
          شماره تلفن
        </PhoneInputBox>
        <p className="text-accent-pink text-sm">{errors.username}</p>

        <InputBox
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (e.currentTarget.value.length > 5) {
              setErrors({ ...errors, fullname: '' });
            } else setErrors({ ...errors, fullname: 'نام کوتاه است' });
          }}
          name="fullName"
          placeholder="نام کامل"
          ref={fullNameRef}
        >
          نام کامل
        </InputBox>
        <p className="text-accent-pink text-sm">{errors.fullname}</p>
        <InputBox
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                e.currentTarget.value
              )
            ) {
              setErrors({ ...errors, email: '' });
            } else setErrors({ ...errors, email: 'ایمیل وارد شده صحبح نیست' });
          }}
          name="email"
          placeholder="آدرس ایمیل"
          ref={emailRef}
        >
          آدرس ایمیل
        </InputBox>
        <p className="text-accent-pink text-sm">{errors.email}</p>

        <InputBox
          type={'password'}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (
              !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,32}$/.test(
                e.currentTarget.value
              )
            ) {
              setErrors({
                ...errors,
                password:
                  'رمز عبور باید بیش از ۸ کاراکتر و شامل حروف و اعداد باشد',
              });
            } else {
              setErrors({ ...errors, password: '' });
            }
          }}
          showEye={false}
          name="password"
          placeholder="رمز عبور"
          ref={passwordRef}
        >
          رمز عبور
        </InputBox>
        <p className="text-accent-pink text-sm">{errors.password}</p>
        <InputBox
          showEye={false}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (e.currentTarget.value != passwordRef.current?.value) {
              setErrors({
                ...errors,
                validatePassword: 'رمز عبور و تکرار آن باید برابر باشند',
              });
            } else
              setErrors({
                ...errors,
                validatePassword: '',
              });
          }}
          type={'password'}
          name="validatePassword"
          placeholder="تایید رمز عبور"
          ref={validatePasswordRef}
        >
          تایید رمز عبور
        </InputBox>
        <p className="text-accent-pink text-sm">{errors.validatePassword}</p>
        <SubmitButton
          className="self-center"
          type={'submit'}
          disabled={editUserInformaion.isPending || changePasswordFn.isPending}
        >
          {editUserInformaion.isPending || changePasswordFn.isPending
            ? 'در حال ذخیره...'
            : 'ثبت'}
        </SubmitButton>
      </form>
      <div className="flex flex-col text-background items-center justify-center p-10 bg-accent-pink rounded-lg">
        <strong>
          برای دسترسی به دسته محصولات مربوط به پزشکان گرامی، مدارک خود را به شرح
          زیر به واتساپ 09025548887 ارسال نماید.
        </strong>
        <p>مدارک مورد نیاز:</p>
        <ul className="w-full list-disc">
          <li>شماره تلفن همراه(شماره ای که با آن در سایت ثبت نام کرده اید)</li>
          <li>شماره نظام پزشکی</li>
          <li>تصویر پروانه طبابت</li>
          <li>تصویر کارت ملی</li>
          <li>تصویر سلفی با کارت ملی</li>
        </ul>
        <SubmitButton link="https://wa.me/09025548887">
          ارسال مدارک پزشک
        </SubmitButton>
      </div>
      {user && !user.phoneConfirmed && usernameChange && <ConfirmPhoneForm />}
    </div>
  );
}
