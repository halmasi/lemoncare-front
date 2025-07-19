'use server';
import qs from 'qs';
import { requestData } from './dataFetch';
import { AddressProps, OrderHistoryProps } from '@/app/utils/schema/userProps';
import { loginCheck } from '../actions/actionMethods';
import { cleanPhone, isPhone } from '../miniFunctions';
import { loginSchema } from '../schema/formValidation';
import { cache } from 'react';
import { getPost } from './getPosts';
import { getProduct } from './getProducts';
import { PostsProps } from '../schema/blogProps';
import { ProductProps } from '../schema/shopProps';

export const updateUserInformation = async (
  id: string,
  token: string,
  userData: {
    confirmed?: boolean;
    phoneConfirmed?: boolean;
    fullName?: string;
    username?: string;
    email?: string;
    password?: string;
  }
) => {
  const response = await requestData({
    qs: `/users/${id}`,
    method: 'PUT',
    body: userData,
    token: `Bearer ${token}`,
  });
  return response.data;
};

export const changePassword = async ({
  newPassword,
  token,
}: {
  newPassword: string;
  token: string;
}) => {
  const check = await loginCheck();
  const response = await requestData({
    qs: `/users/change-password-without-old/${check.body.id}`,
    method: 'PUT',
    body: { newPassword },
    token: `Bearer ${token}`,
  });
  return { data: response.data, status: response.status };
};

export const getPostalInformation = async (documentId: string) => {
  const check = await loginCheck();
  const query = qs.stringify({
    populate: {
      information: { populate: '1' },
    },
  });

  const response = await requestData({
    qs: `/postal-informations/${documentId}?${query}`,
    method: 'GET',
    token: check.jwt,
  });
  return response.data;
};

export const updatePostalInformation = async (
  newAddressList: AddressProps[],
  id: string
) => {
  const check = await loginCheck();
  const response = await requestData({
    qs: `/postal-informations/${id}`,
    method: 'PUT',
    body: {
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
    token: check.jwt,
  });
  const data = response.data;
  return data;
};

export const getOrderHistory = async (
  page: number = 1,
  pageSize: number = 10
) => {
  const check = await loginCheck();
  const query = qs.stringify({
    filters: { user: { $eq: check.body.id } },
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
    pagination: {
      page,
      pageSize,
    },
    sort: { createdAt: 'desc' },
  });
  const response = await requestData({
    qs: `/order-histories?${query}`,
    method: 'GET',
    token: check.jwt,
  });
  return response.data;
};

export const getSingleOrderHistory = async (orderCode: number) => {
  const check = await loginCheck();

  const query = qs.stringify({
    filters: {
      order: {
        orderCode: {
          $eq: orderCode,
        },
      },
    },
    populate: {
      user: {
        populate: '1',
      },
      order: {
        populate: {
          items: {
            populate: '*',
          },
          coupon: { populate: '*' },
        },
      },
    },
  });

  const res = await requestData({
    qs: `/order-histories?${query}`,
    method: 'GET',
    token: check.jwt,
  });
  if (res.data.data[0].user.username == check.body.username) {
    const finalRes: OrderHistoryProps = res.data.data[0];
    return finalRes;
  }
  return null;
};

export const updateOrderHistory = async (documentId: string, data: object) => {
  const check = await loginCheck();
  const res = await requestData({
    qs: `/order-histories/${documentId}`,
    method: 'PUT',
    body: { data },
    token: check.jwt,
  });
  return res.data;
};

export const getFavorites = cache(
  async (documentId: string, whichOne: 'posts' | 'products') => {
    const check = await loginCheck();
    const populateSelector = {
      posts: {
        basicInfo: { populate: ['mainImage'] },
        seo: { populate: '1' },
      },
      products: {
        basicInfo: { populate: ['mainImage'] },
        seo: { populate: '1' },
        variety: { populate: '*' },
      },
    };

    const query = qs.stringify({
      populate: {
        [whichOne]: {
          populate: populateSelector[whichOne],
        },
      },
    });
    const response = await requestData({
      qs: `/favorites/${documentId}?${query}`,
      method: 'GET',
      token: check.jwt,
    });
    return response.data;
  }
);

export const updateFavorite = async (
  userFavoriteDocumentId: string,
  propertyDocumentId: string,
  whichOne: 'posts' | 'products'
) => {
  const check = await loginCheck();
  const favoriteResponse = await getFavorites(userFavoriteDocumentId, whichOne);
  const currentFavorites = favoriteResponse.data[whichOne];

  const checkExists = favoriteResponse.data[whichOne].some(
    (item: any) => item.documentId === propertyDocumentId
  );

  let updatedFavorites;

  if (checkExists) {
    updatedFavorites = currentFavorites.filter((item: any) => {
      const keep = item.documentId !== propertyDocumentId;
      return keep;
    });
  } else if (!checkExists) {
    const which = {
      posts: await getPost(propertyDocumentId),
      products: (await getProduct(propertyDocumentId)).res,
    };
    const newInfo: PostsProps[] | ProductProps[] = which[whichOne];

    updatedFavorites = [...currentFavorites, newInfo[0]];
  }
  const response = await requestData({
    qs: `/favorites/${userFavoriteDocumentId}`,
    method: 'PUT',
    body: {
      data: {
        [whichOne]: updatedFavorites.map((item: any) => item.id),
      },
    },
    token: check.jwt,
  });
  return response.data;
};

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

  const response = await requestData({ qs: `/users?${query}`, method: 'GET' });
  return {
    data: response.data[0],
    isPhone: isPhone(response.data.username),
    success: response.data.length > 0,
    error: [],
  };
};
