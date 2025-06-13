'use client';

import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { getFavorites } from '@/app/utils/data/getUserInfo';
import { useDataStore } from '@/app/utils/states/useUserdata';
import BookmarkContent from '@/app/components/profile/favorites/BookmarkContent';
import { toast } from 'react-toastify';

export default function Bookmarks() {
  const { user } = useDataStore();
  const [bookmarksData, setBookmarksData] = useState();

  const getFavoritesFn = useMutation({
    mutationFn: async (documentId: string) => {
      const res = await getFavorites(documentId, 'posts');
      return res.data || [];
    },
    onSuccess: (data) => {
      setBookmarksData(data.posts);
    },
    onError: (error: { message: string[] }) => {
      toast.error('Error fetching Bookmarks:' + error.message);
    },
  });

  useEffect(() => {
    if (user && user.favorite) {
      getFavoritesFn.mutateAsync(user.favorite.documentId);
    }
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-center gap-4 mb-8"></div>
      {bookmarksData && (
        <BookmarkContent
          posts={bookmarksData}
          onToggleFavorite={(postId) =>
            setBookmarksData((prev: any) =>
              prev.filter((p: any) => p.documentId !== postId)
            )
          }
        />
      )}
    </div>
  );
}
