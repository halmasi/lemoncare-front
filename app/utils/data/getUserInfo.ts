'use server';
import qs from 'qs';
import { requestData } from './dataFetch';
import { AddressProps } from '@/app/utils/schema/userProps';
import { loginCheck } from '../actions/actionMethods';
import { cleanPhone, isPhone } from '../miniFunctions';
import { loginSchema } from '../schema/formValidation';
import { cache } from 'react';

export const updateUserInformation = async (
  id: string,
  token: string,
  userData: {
    fullName?: string;
    username?: string;
    email?: string;
  }
) => {
  if (userData.username) {
    userData.username = '98' + userData.username;
  }
  const response = await requestData(
    `/users/${id}`,
    'PUT',
    userData,
    `Bearer ${token}`
  );
  return response.data;
};
export const getPostalInformation = async (documentId: string) => {
  const check = await loginCheck();
  const query = qs.stringify({
    populate: {
      information: { populate: '1' },
    },
  });

  const response = await requestData(
    `/postal-informations/${documentId}?${query}`,
    'GET',
    {},
    check.jwt
  );
  return response.data;
};

export const updatePostalInformation = async (
  newAddressList: AddressProps[],
  id: string
) => {
  const check = await loginCheck();
  const response = await requestData(
    `/postal-informations/${id}`,
    'PUT',
    {
      data: {
        information: newAddressList.map((item) => ({
          address: item.address,
          province: item.province,
          city: item.city,
          firstName: item.firstName,
          lastName: item.lastName,
          mobileNumber: item.mobileNumber,
          phoneNumber: item.phoneNumber,
          postCode: item.postCode,
        })),
      },
    },
    check.jwt
  );
  const data = response.data;
  return data;
};

export const getOrderHistory = async (documentId: string) => {
  const check = await loginCheck();
  const query = qs.stringify({
    populate: {
      order: {
        populate: {
          items: {
            populate: {
              product: { populate: { basicInfo: { populate: ['mainImage'] } } },
            },
          },
        },
      },
    },
  });

  const response = await requestData(
    `/order-histories/${documentId}?${query}`,
    'GET',
    {},
    check.jwt
  );
  return response.data;
};

export const getFavorites = cache(
  async (documentId: string, whichOne: 'posts' | 'products') => {
    const check = await loginCheck();
    const query = qs.stringify({
      populate: {
        [whichOne]: {
          populate: {
            basicInfo: { populate: ['mainImage'] },
            seo: { populate: '1' },
          },
        },
      },
    });
    const response = await requestData(
      `/favorites/${documentId}?${query}`,
      'GET',
      {},
      check.jwt
    );
    console.log('response Favorite : ', response, '\n', documentId);
    return response.data;
  }
);

export const getGravatar = async (email: string) => {
  const get = await fetch(process.env.SITE_URL + '/api/auth/gravatar', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ email: email }),
  });

  const gravatarJson = await get.json();
  return JSON.parse(gravatarJson).url;
};

export const checkUserExists = async (identifier: string) => {
  identifier = cleanPhone(identifier);
  const validationResult = loginSchema
    .pick({ identifier: true })
    .safeParse({ identifier });
  if (!validationResult.success) {
    return {
      isPhone: false,
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
    isPhone: isPhone(response.data.username),
    success: response.data.length > 0,
    error: [],
  };
};
