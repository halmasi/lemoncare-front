'use server';

import { loginSchema, registerSchema } from '@/app/utils/schema/formValidation';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import qs from 'qs';
import { requestData } from '@/app/utils/data/dataFetch';

export const registerAction = async (
  username: string,
  email: string,
  password: string
) => {
  let success = false;
  const fieldErrors: {
    username: string[];
    email: string[];
    password: string[];
    server: string[];
  } = {
    username: [],
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

  username = username.includes('9')
    ? username.slice(username.indexOf('9'))
    : username;

  const validationResult = registerSchema.safeParse({
    username,
    email,
    password,
  });

  if (validationResult.error) {
    const errors = validationResult.error.flatten().fieldErrors;
    if (errors.username) fieldErrors.username.push(...errors.username);
    if (errors.email) fieldErrors.email.push(...errors.email);
    if (errors.password) fieldErrors.password.push(...errors.password);
  }
  if (validationResult.success) {
    const response = await requestData('/auth/local/register', 'POST', {
      username: '98' + validationResult.data.username,
      email: validationResult.data.email,
      password: validationResult.data.password,
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
    const errors = validationResult.error.flatten().fieldErrors;
    if (errors.email) fieldErrors.email.push(...errors.email);
    if (errors.pass) fieldErrors.password.push(...errors.pass);
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
