'use client';

import { getFavorites } from '@/app/utils/data/getUserInfo';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export default function Favorites() {
  const { user } = useDataStore();
  const [favoritesData, setFavoritesData] = useState([]);

  const getFavoritesFn = useMutation({
    mutationFn: async (documentId: string) => {
      const res = await getFavorites(documentId);
      // console.log('response Fav : ', res);
      // console.log('response DocumentID : ', documentId);
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
  // console.log('user favorites : ', favoritesData);
  return (
    <div>
      <h1>Favorites</h1>
      {favoritesData.length > 0 ? (
        <ul>
          {favoritesData.map((favorite, index) => (
            <li key={index}>{favorite}</li>
          ))}
        </ul>
      ) : (
        <p>No favorites found.</p>
      )}
    </div>
  );
}
