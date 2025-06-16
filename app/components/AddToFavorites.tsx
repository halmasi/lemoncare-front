'use client';

import {
  BsBookmark,
  BsBookmarkFill,
  BsHeart,
  BsHeartFill,
} from 'react-icons/bs';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { useDataStore } from '../utils/states/useUserdata';
import { getFavorites, updateFavorite } from '../utils/data/getUserInfo';
import { PostsProps } from '../utils/schema/blogProps';
import { ProductProps } from '../utils/schema/shopProps';
import { toast } from 'react-toastify';
import { VscLoading } from 'react-icons/vsc';

export default function AddToFavorites({
  product,
  post,
  onUnfavorite,
}: {
  product?: ProductProps;
  post?: PostsProps;
  onUnfavorite?: () => void;
}) {
  const { user } = useDataStore();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [whichOne] = useState<'posts' | 'products'>(
    post ? 'posts' : 'products'
  );
  useEffect(() => {
    if (user && user.favorite)
      getFavoritesFn.mutateAsync({
        documentId: user.favorite.documentId,
        propertyDocumentId: post ? post.documentId : product!.documentId,
      });
  }, [user]);

  const getFavoritesFn = useMutation({
    mutationFn: async ({
      documentId,
      propertyDocumentId,
    }: {
      documentId: string;
      propertyDocumentId: string;
    }) => {
      const favorites = await getFavorites(documentId, whichOne);
      return { favorites: favorites.data, whichOne, propertyDocumentId };
    },
    onSuccess: (data) => {
      if (!data) return;
      const found = data.favorites[data.whichOne].find(
        (item: PostsProps | ProductProps) => {
          return item.documentId == data.propertyDocumentId;
        }
      );
      if (found) setIsFavorite(true);
    },
  });

  const clickHandlerFn = useMutation({
    mutationFn: async () => {
      if (user && user.favorite)
        return await updateFavorite(
          user.favorite.documentId,
          post ? post.documentId : product!.documentId,
          whichOne
        );
    },
    onSuccess: () => {
      if (isFavorite) {
        setIsFavorite(false);
        onUnfavorite?.(); // remove from parent list if needed
      } else {
        setIsFavorite(true);
      }
    },
    onError: (err) => {
      toast.error('Favorite update failed:' + err);
    },
  });

  const handleClick = () => {
    if (!user || clickHandlerFn.isPending) return;
    clickHandlerFn.mutate();
  };

  if (!user) return null;

  const commonProps = {
    onClick: handleClick,
    disabled: clickHandlerFn.isPending,
    className: 'mt-3  transition-transform duration-200',
    'aria-label': isFavorite ? 'Remove from favorites' : 'Add to favorites',
  };

  return (
    <div className="flex items-center justify-center p-2 w-12 h-12">
      {clickHandlerFn.isPending ? (
        <VscLoading className="text-accent-pink animate-spin" />
      ) : product ? (
        <button {...commonProps}>
          {!isFavorite ? (
            <BsHeartFill className="text-accent-pink/80 hover:text-accent-pink transition-colors duration-200" />
          ) : (
            <BsHeart className="hover:text-red-600 transition-colors duration-200" />
          )}
        </button>
      ) : (
        <button {...commonProps}>
          {!isFavorite ? (
            <BsBookmarkFill className="text-accent-pink/80 hover:text-accent-pink transition-colors duration-200" />
          ) : (
            <BsBookmark className="hover:text-red-600 transition-colors duration-200" />
          )}
        </button>
      )}
    </div>
  );
}
