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
  const response: {
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

export const googleAuthAction = async (accessToken: string) => {
  const response = await requestData('/auth/google/callback', 'POST', {
    access_token: accessToken,
  });

  if (response.data.error) {
    throw new Error(response.data.error.message);
  }
  return response.data;
};

export const loginCheck = async (_?: string) => {
  const token = await getCookie('jwt');
  const response = await requestData('/users/me', 'GET', {}, token);
  const data: {
    id: number;
    documentId: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    username: string;
    fullName: string;
  } = response.data;
  return {
    status: response.status,
    body: data,
    jwt: token,
  };
};

export const getFullUserData = async (
  isDeep: boolean = false,
  populateOptions?: object[]
) => {
  const defaultOptions = {
    order_history: { populate: '*' },
    shopingCart: { populate: '1' },
    postal_information: { populate: '1' },
  };
  const options = populateOptions
    ? Object.assign(defaultOptions, ...populateOptions)
    : defaultOptions;
  const query = qs.stringify({
    populate: options,
  });
  const token = await getCookie('jwt');

  const response = await requestData(
    `/users/me?${isDeep ? 'pLevel' : query}`,
    'GET',
    {},
    `${token}`
  );
  return { status: response.status, body: response.data };
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
  cookies().delete('jwt');
  redirect('/login');
};

export const RunTest = async (token: string | null) => {
  const userId = 1;

  try {
    const updateReq = await requestData(
      `/users/${userId}`,
      'PUT',
      {
        cart: [
          {
            id: 14,
            count: 9,
            // variety: {
            // id: 1000000004,
            // sub: null,
            // },
            // product: { documentId: 'ti4elghq9pj6hfckkwjd9dev' },
          },
        ],
      },

      `Bearer ${token}`
    );
    console.log('Update Response:', updateReq.data);

    const fetchReq = await requestData(
      `/users/me?populate=*`,
      'GET',
      {},
      `Bearer ${token}`
    );
    console.log('Updated User Data:', fetchReq.data);

    return { status: fetchReq.status, body: fetchReq.data };
  } catch (error) {
    console.error('Error in RunTest:', error);
    return { status: 500, body: { message: 'Internal Server Error' } };
  }
};
