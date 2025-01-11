'use server';

import { loginSchema, registerSchema } from '@/app/utils/schema/formValidation';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
export const registerAction = async (
  _prevState: object,
  formData: FormData
) => {
  const username = formData.get('username')?.toString();
  const email = formData.get('email')?.toString();
  let phoneNumber = formData.get('phoneNumber')?.toString();
  const password = formData.get('password')?.toString();

  phoneNumber = phoneNumber?.includes('9')
    ? phoneNumber.slice(phoneNumber.indexOf('9'))
    : phoneNumber;

  const result = registerSchema.safeParse({
    username,
    email,
    phoneNumber,
    password,
  });

  if (!result.success) {
    console.log('Validation failed:', result.error);
    return { success: false, fieldErrors: result.error.flatten().fieldErrors };
  }

  try {
    const res = await fetch(`${process.env.BACKEND_PATH}/auth/local/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        username: result.data.username,
        password: result.data.password,
        email: result.data.email,
        phone: result.data.phoneNumber,
      }),
    });
    const reqResult = await res.json();

    const { jwt, user } = reqResult;
    console.log('Here is the result1 : \n', result);
    console.log('Here is the result2 : \n', res);
    console.log('Here is the result3 : \n', reqResult);

    console.log('Phone output : ', phoneNumber);

    return { jwt, user };
  } catch (error) {
    console.error('API error:', error);
    return { success: false, fieldErrors: { server: ['خطای سرور رخ داد'] } };
  }
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

  try {
    const res = await fetch(`${process.env.BACKEND_PATH}/auth/local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: result.data.email,
        password: result.data.pass,
      }),
    });
    const reqResualt = await res.json();
    const { jwt, user } = reqResualt;

    return { jwt, user };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      fieldErrors: {
        server: ['خطایی رخ داد، لطفا دوباره تلاش کنید'],
      },
    };
  }
};

export const loginCheck = async (token: string) => {
  const authentication = await fetch(process.env.BACKEND_PATH + '/users/me', {
    credentials: 'include',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
  });
  const result = await authentication.json();
  return { status: authentication.status, body: result };
};

export const setCookie = async (name: string, cookie: string) => {
  const config = {
    path: 'login/',
    httpOnly: true,
    // secure: process.env.NODE_ENV === 'production',
  };

  const cookieStore = cookies();
  cookieStore.set(name, cookie, config);
};

export const logoutAction = async () => {
  await setCookie('jwt', 'null');
  redirect('/login');
};
