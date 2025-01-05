'use server';

import { loginSchema } from '@/app/utils/schema/formValidation';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const signinAction = async (_prevState: any, formData: FormData) => {
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
    // console.log(reqResualt);
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
  console.log(cookieStore);
};

export const logoutAction = async () => {
  await setCookie('jwt', 'null');
  redirect('/login');
};
