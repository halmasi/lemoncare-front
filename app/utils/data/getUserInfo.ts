'use server';
import qs from 'qs';
import { requestData } from './dataFetch';
import { AddressProps } from '@/app/utils/schema/userProps';
import { loginCheck } from '../actions/actionMethods';

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
  // console.log(response);
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

export const getGravatar = async (email: string) => {
  const get = await fetch(process.env.SITE_URL + '/api/auth/gravatar', {
    method: 'POST',
    body: JSON.stringify({ email: email }),
  });
  const result = await get.json();
  return { result, status: get.status };
};
