'use server';

import { loginSchema, registerSchema } from '@/app/utils/schema/formValidation';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import qs from 'qs';
import { requestData } from '@/app/utils/data/dataFetch';
export const registerAction = async (
  _prevState: object,
  formData: FormData
) => {
  let username = formData.get('username')?.toString();
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  username = username?.includes('9')
    ? username.slice(username.indexOf('9'))
    : username;
  const result = registerSchema.safeParse({
    username,
    email,
    password,
  });

  if (!result.success) {
    return { success: false, fieldErrors: result.error.flatten().fieldErrors };
  }

  const res = await requestData('/auth/local/register', 'POST', {
    username: '98' + result.data.username,
    password: result.data.password,
    email: result.data.email,
  });

  const { jwt, user } = res.data;
  return { jwt, user };
};

export const signinAction = async (_prevState: object, formData: FormData) => {
  const email = formData.get('identifier')?.toString() || null;
  const password = formData.get('password')?.toString() || null;

  if (!email || !password) {
    return {
      success: false,
      fieldErrors: {
        email: !email ? ['ایمیل الزامی است'] : undefined,
        password: !password ? ['رمز عبور الزامی است'] : undefined,
      },
    };
  }

  const result = loginSchema.safeParse({
    email,
    pass: password,
  });

  if (!result.success) {
    return {
      success: false,
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }
  const res = await requestData('/auth/local', 'POST', {
    identifier: result.data.email,
    password: result.data.pass,
  });
  const { jwt, user } = res.data;
  return { jwt, user };
};

export const loginCheck = async (token: string) => {
  const res = await requestData('/users/me', 'GET', {}, token);
  return { status: res.result.status, body: res };
};

export const GetfulluserData = async (token: string) => {
  const query = qs.stringify({
    populate: '*',
  });
  const res = await requestData(
    `/users/me?${query}`,
    'GET',
    {},
    `Bearer ${token}`
  );
  return { status: res.result.status, body: res.data };
};

export const setCookie = async (name: string, cookie: string) => {
  const config = {
    path: 'login/',
    httpOnly: true,
    // secure: process.env.NODE_ENV === 'production',
  };

  cookies().set(name, cookie, config);
};

export const logoutAction = async () => {
  cookies().set('jwt', 'null');
  await setCookie('jwt', 'null');
  redirect('/login');
};
