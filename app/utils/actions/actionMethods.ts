'use server';

import { loginSchema, registerSchema } from '@/app/utils/schema/formValidation';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import qs from 'qs';
import { requestData } from '@/app/utils/data/dataFetch';

export const checkUserExists = async (identifier: string) => {
  if (/^(\+98|98|0)?9\d{9}$/.test(identifier)) {
    identifier = identifier.replace(/^(\+98|98|0)?/, '');
  }
  const validationResult = loginSchema
    .pick({ identifier: true })
    .safeParse({ identifier });
  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error.flatten().fieldErrors.identifier || [
        'ایمیل یا شماره تلفن نامعتبر است',
      ],
    };
  }

  const query = qs.stringify({
    filters: {
      $or: [{ email: identifier }, { username: '98' + identifier }],
    },
  });

  const response = await requestData(`/users?${query}`, 'GET', {});
  return {
    success: response.data.length > 0,
  };
};

export const registerAction = async (
  username: string,
  email: string,
  password: string
) => {
  let success = false;
  let q = '';
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

  if (/^(\+98|98|0)?9\d{9}$/.test(username)) {
    username = username.replace(/^(\+98|98|0)?/, '');
  }
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
      const userId = response.data.user.id;

      const requests = [
        { url: '/carts', data: { user: userId, items: [] } },
        { url: '/order-histories', data: { user: userId, order: [] } },
        {
          url: '/postal-informations',
          data: { user: userId, information: [] },
        },
        { url: '/favorites', data: { user: userId, posts: [], products: [] } },
      ];

      await Promise.all(
        requests.map(({ url, data }) =>
          requestData(url, 'POST', { data }, `Bearer ${response.data.jwt}`)
        )
      );
    }
  }

  return {
    success,
    jwt: response.data.jwt,
    user: response.data.user,
    fieldErrors,
  };
};

export const signinAction = async (identifier: string, password: string) => {
  let success = false;

  const fieldErrors: {
    identifier: string[];
    password: string[];
    server: string[];
  } = {
    identifier: [],
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

  if (!identifier)
    fieldErrors.identifier.push('ایمیل یا شماره تلفن الزامی است');
  if (!password) fieldErrors.password.push('رمز عبور الزامی است');

  if (/^(\+98|98|0)?9\d{9}$/.test(identifier)) {
    identifier = identifier.replace(/^(\+98|98|0)?/, '');
  }
  const validationResult = loginSchema.safeParse({
    identifier,
    pass: password,
  });

  if (validationResult.error) {
    const errors = validationResult.error.flatten().fieldErrors;
    if (errors.identifier) fieldErrors.identifier.push(...errors.identifier);
    if (errors.pass) fieldErrors.password.push(...errors.pass);
  }

  if (validationResult.success) {
    if (/^9\d{9}$/.test(validationResult.data?.identifier)) {
      validationResult.data.identifier =
        '98' + validationResult.data.identifier;
    }
    response = await requestData('/auth/local', 'POST', {
      identifier: validationResult.data.identifier,
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
