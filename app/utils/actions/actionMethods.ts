'use server';

import { loginSchema, registerSchema } from '@/app/utils/schema/formValidation';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import qs from 'qs';
import { requestData } from '@/app/utils/data/dataFetch';
import { SignInState } from '@/app/utils/schema/userProps';

export const registerAction = async (
  _prevState: object,
  formData: FormData
) => {
  let username = formData.get('username')?.toString();
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  if (!username || !email || !password) {
    return {
      success: false,
      fieldErrors: { server: ['تمامی فیلد ها اجباری میباشد'] },
    };
  }
  username = username?.includes('9')
    ? username.slice(username.indexOf('9'))
    : username;
  const validationResult = registerSchema.safeParse({
    username,
    email,
    password,
  });

  if (!validationResult.success) {
    return {
      success: false,
      fieldErrors: validationResult.error.flatten().fieldErrors,
    };
  }

  const response = await requestData('/auth/local/register', 'POST', {
    username: '98' + validationResult.data.username,
    email: validationResult.data.email,
    password: validationResult.data.password,
  });
  if (response.data.error) {
    return {
      success: false,
      fieldErrors: { server: [response.data.error.message || 'خطای سرور'] },
    };
  }
  return {
    success: true,
    jwt: response.data.jwt,
    user: response.data.user,
    fieldErrors: {},
  };
};

export const signinAction = async (
  _prevState: SignInState,
  formData: FormData
) => {
  const email = formData.get('identifier')?.toString();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return {
      success: false,
      fieldErrors: {
        email: !email ? ['ایمیل الزامی است'] : undefined,
        password: !password ? ['رمز عبور الزامی است'] : undefined,
      },
    };
  }

  const validationResult = loginSchema.safeParse({
    email,
    pass: password,
  });

  if (!validationResult.success) {
    return {
      success: false,
      fieldErrors: validationResult.error.flatten().fieldErrors,
    };
  }
  const response = await requestData('/auth/local', 'POST', {
    identifier: validationResult.data.email,
    password: validationResult.data.pass,
  });

  if (response.data.error) {
    return {
      success: false,
      fieldErrors: { server: [response.data.error.message || 'خطای سرور'] },
    };
  }

  return {
    success: true,
    jwt: response.data.jwt,
    user: response.data.user,
    fieldErrors: {},
  };
};

export const loginCheck = async (token: string) => {
  const response = await requestData('/users/me', 'GET', {}, token);
  return { status: response.result.status, body: response };
};

export const getFullUserData = async (
  token: string,
  populateOptions: object[] = []
) => {
  const query = qs.stringify({
    populate: Object.assign({ cart: { populate: '*' } }, ...populateOptions),
  });

  const response = await requestData(
    `/users/me?${query}`,
    'GET',
    {},
    `Bearer ${token}`
  );
  return { status: response.result.status, body: response.data };
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
  await setCookie('jwt', 'null');
  redirect('/login');
};

// export const RunTest = async (token: string) => {
// const num = 29;
//
// const req = await requestData(
// `/users/${num}`,
// 'PUT',
// {
// username: '09187112855',
// },
// `Bearer ${token}`
// );
// return { status: req.result.status, body: req.data };
// };
