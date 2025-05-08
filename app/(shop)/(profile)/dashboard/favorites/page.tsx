'use client';

import { getFavorites } from '@/app/utils/data/getUserInfo';
import { FavoriteListProps } from '@/app/utils/schema/userProps';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export default function Favorites() {
  const { user } = useDataStore();
  const [favoritesData, setFavoritesData] = useState<FavoriteListProps>();

  const getFavoritesFn = useMutation({
    mutationFn: async (documentId: string) => {
      const res = await getFavorites(documentId);
      console.log('response Fav : ', res);
      console.log('response DocumentID : ', documentId);
      return res.data || [];
    },
    onSuccess: (data) => {
      setFavoritesData(data);
    },
    onError: (error: { message: string[] }) => {
      console.error('Error fetching favorites:', error.message);
    },
  });

  useEffect(() => {
    if (user && user.favorites) {
      Promise.all(
        user.favorites.map((favorite) => {
          const documentId = favorite.documentId;
          if (documentId) {
            return getFavoritesFn.mutateAsync(documentId);
          }
          return Promise.resolve();
        })
      );
    }
  }, [user]);
  console.log('user favorites : ', favoritesData);
  return (
    <>
      {favoritesData ? (
        <div>
          <h1>Favorite products</h1>
          <ul>
            {favoritesData.products.map((product) => (
              <li key={product.id}>
                <h2>{product.basicInfo.title}</h2>
                <img
                  src={product.basicInfo.mainImage.url}
                  alt={product.basicInfo.title}
                  width={100}
                  height={100}
                />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
