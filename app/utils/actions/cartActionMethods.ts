'use server';

import { cookies } from 'next/headers';
import { requestData } from '../data/dataFetch';
import { loginCheck } from './actionMethods';
import { CartProps } from '../states/useUserdata';

export const updateCart = async (cart: CartProps[]) => {
  const token = cookies().get('jwt')?.value;

  if (token) {
    const check = await loginCheck(token);
    const userData: {
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
    } = check.body.data;

    cart.map(async (item) => {
      await requestData(
        `/users/${userData.id}`,
        'PUT',
        {
          cart: [
            { id: 11, count: 5, product: item.product, variety: item.variety },
          ],
        },
        token
      );
    });

    // await requestData(
    //   `/users/${userData.id}`,
    //   'PUT',
    //   {
    //     cart: [],
    //   },
    //   token
    // );

    // return response;
  }
};
