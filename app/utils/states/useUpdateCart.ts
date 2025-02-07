import { useMutation } from '@apollo/client';
import { updateUser } from '@/app/utils/data/graphql/updateUser';

export const useUpdateCart = () => {
  const [mutateUser, { data, loading, error }] = useMutation(updateUser);

  const updateCart = async (cart: any[], userId: number) => {
    try {
      const res = await mutateUser({
        variables: {
          id: userId,
          data: { cart: cart },
        },
      });
      console.log('Mutation response:', res);
      return res;
    } catch (err) {
      console.error('Mutation error:', err);
      throw err;
    }
  };

  return { updateCart, loading, error };
};
