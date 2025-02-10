import { requestData } from '../data/dataFetch';
import { CartProps } from '../states/useCartData';

export const updateCart = async (
  id: string,
  cart: CartProps[],
  jwt: string
) => {
  const response = await requestData(
    `/users/me${id}`,
    'PUT',
    {
      data: {
        cart,
      },
    },
    jwt
  );
  return response.result.status;

  return `updating user ${id}, nre cart: ${cart}`;
};
