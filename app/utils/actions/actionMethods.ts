'use server';

import { loginSchema, registerSchema } from '@/app/utils/schema/formValidation';
import { cookies } from 'next/headers';
import qs from 'qs';
import { requestData } from '@/app/utils/data/dataFetch';
import { cleanPhone } from '../miniFunctions';

export const registerAction = async ({
  username,
  password,
}: {
  username: string;
  // email: string,
  password: string;
}) => {
  const fieldErrors: {
    username: string[];
    // email: string[];
    password: string[];
    server: string[];
  } = {
    username: [],
    // email: [],
    password: [],
    server: [],
  };
  username = '98' + cleanPhone(username);
  const validationResult = registerSchema.safeParse({
    username: username,
    // email,
    password,
  });

  if (validationResult.error) {
    const errors = validationResult.error.flatten().fieldErrors;
    if (errors.username) fieldErrors.username.push(...errors.username);
    // if (errors.email) fieldErrors.email.push(...errors.email);
    if (errors.password) fieldErrors.password.push(...errors.password);
  }
  if (validationResult.success) {
    const response = await requestData({
      qs: '/auth/local/register',
      method: 'POST',
      body: {
        username: validationResult.data.username,
        // email: validationResult.data.email,
        password: validationResult.data.password,
      },
    });

    if (response.data.error) {
      fieldErrors.server.push(response.data.error.message);
      return { success: false, fieldErrors };
    } else {
      const userId = response.data.user.id;

      const requests = [
        { url: '/carts', data: { user: userId, items: [] } },
        // { url: '/order-histories', data: { user: userId, order: [] } },
        {
          url: '/postal-informations',
          data: { user: userId, information: [] },
        },
        { url: '/favorites', data: { user: userId, posts: [], products: [] } },
      ];

      await Promise.all(
        requests.map(({ url, data }) =>
          requestData({
            qs: url,
            method: 'POST',
            body: { data },
            token: `Bearer ${response.data.jwt}`,
          })
        )
      );
      return {
        success: true,
        fieldErrors,
        user: userId,
      };
    }
  }
  return {
    success: false,
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
  identifier = cleanPhone(identifier);
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
    response = await requestData({
      qs: '/auth/local',
      method: 'POST',
      body: {
        identifier: validationResult.data.identifier,
        password: validationResult.data.pass,
      },
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

export const loginCheck = async () => {
  const token = await getCookie('jwt');
  const response = await requestData({ qs: '/users/me', method: 'GET', token });
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
    isAuthenticated: response.status === 200,
    body: data,
    jwt: token,
  };
};

export const getFullUserData = async (input?: {
  isDeep?: boolean;
  token?: string;
  populateOptions?: object[];
}) => {
  const defaultOptions = {
    shopingCart: { populate: '*' },
    postal_information: { populate: '*' },
    favorite: { populate: '1' },
    order_histories: { populate: '1' },
  };
  const options = input?.populateOptions
    ? Object.assign(defaultOptions, ...input.populateOptions)
    : defaultOptions;
  const query = qs.stringify({
    populate: options,
  });
  const getToken = await getCookie('jwt');

  const response = await requestData({
    qs: `/users/me?${input?.isDeep ? 'pLevel' : query}`,
    method: 'GET',
    token: input && input.token ? input.token : getToken,
  });
  return { status: response.status, body: response.data };
};

export const removeUser = async (id: number) => {
  const response = await requestData({
    qs: `/users/${id}`,
    method: 'DELETE',
  });
  return response;
};

export const setCookie = async (name: string, cookie: string) => {
  const config = {
    path: 'login/',
    httpOnly: true,
    // secure: process.env.NODE_ENV === 'production',
  };

  (await cookies()).set(name, cookie, config);
};

export const getCookie = async (key: string) => {
  return (await cookies()).get(key)?.value;
};
export const deleteCookie = async (key: string) => {
  (await cookies()).delete(key);
};

export const logoutAction = async () => {
  (await cookies()).delete('jwt');
};
