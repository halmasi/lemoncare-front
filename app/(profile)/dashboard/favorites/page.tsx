'use client';

import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { getFavorites } from '@/app/utils/data/getUserInfo';
import { useDataStore } from '@/app/utils/states/useUserdata';
import FavoriteProducts from '@/app/components/profile/favorites/FavoriteProducts';

export default function Favorites() {
  const { user } = useDataStore();
  const [favoritesData, setFavoritesData] = useState();

  const getFavoritesFn = useMutation({
    mutationFn: async (documentId: string) => {
      const res = await getFavorites(documentId, 'products');
      return res.data || [];
    },
    onSuccess: (data) => {
      setFavoritesData(data.products);
    },
    onError: (error: { message: string[] }) => {
      console.error('Error fetching favorites:', error.message);
    },
  });

  useEffect(() => {
    if (user && user.favorite)
      getFavoritesFn.mutateAsync(user.favorite.documentId);
  }, [user]);
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-center gap-4 mb-8"></div>
      {favoritesData && <FavoriteProducts products={favoritesData} />}
    </div>
  );
}
