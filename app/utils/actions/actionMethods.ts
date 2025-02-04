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
  const password = formData.get('passwordS')?.toString();

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

export const signinAction = async (email: string, password: string) => {
  let success = false;

  const fieldErrors: { email: string[]; password: string[]; server: string[] } =
    {
      email: [],
      password: [],
      server: [],
    };

  let response: {
    data: {
      data?: null | '';
      jwt: string;
      user: object;
      error?: { message: string };
    };
  } = {
    data: { jwt: '', user: {} },
  };

  if (!email) fieldErrors.email.push('ایمیل الزامی است');
  if (!password) fieldErrors.password.push('رمز عبور الزامی است');

  const validationResult = loginSchema.safeParse({
    email,
    pass: password,
  });

  if (validationResult.error) {
    const emailError = validationResult.error.flatten().fieldErrors.email;
    const passwordError = validationResult.error.flatten().fieldErrors.pass;
    emailError && emailError.forEach((err) => fieldErrors.email.push(err));
    passwordError &&
      passwordError.forEach((err) => fieldErrors.password.push(err));
  }

  if (validationResult.success) {
    response = await requestData('/auth/local', 'POST', {
      identifier: validationResult.data.email,
      password: validationResult.data.pass,
    });
    if (response.data.error) {
      fieldErrors.server.push(response.data.error.message);
    } else {
      success = true;
    }
  }

  return {
    success,
    jwt: response.data.jwt,
    user: response.data.user,
    fieldErrors,
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

export const getCookie = async (key: string) => {
  return cookies().get(key)?.value;
};

export const logoutAction = async () => {
  await setCookie('jwt', 'null');
  redirect('/login');
};
