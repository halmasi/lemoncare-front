'use server';
import { useMutation } from '@apollo/client';
import { updateUser } from '@/app/utils/data/graphql/updateUser';
import { CartProps } from './useUserdata';

export const useUpdateCart = () => {
  const [mutateUser] = useMutation(updateUser);

  const updateCart = async (cart: CartProps[], userId: number) => {
    try {
      const { data, errors } = await mutateUser({
        variables: {
          id: userId.toString,
          data: JSON.stringify({ cart: cart }),
        },
      });
      console.log('Mutation response:', data);
      return { data, errors };
    } catch (err) {
      console.error('Mutation error:', err);
      throw err;
    }
  };

  return { updateCart };
};
