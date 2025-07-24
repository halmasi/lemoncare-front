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
import { IoTrash } from 'react-icons/io5';

export default function AddToFavorites({
  product,
  post,
  className = '',
  isList = false,
  onFinish,
}: {
  product?: ProductProps;
  post?: PostsProps;
  className?: string;
  isList?: boolean;
  onFinish?: (id: string) => void;
}) {
  const { user } = useDataStore();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [whichOne] = useState<'posts' | 'products'>(
    post ? 'posts' : 'products'
  );

  useEffect(() => {
    if (user && user.favorite)
      getFavoritesFn.mutate({
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
      if (!data || !data.favorites) return;
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
      setIsFavorite(!isFavorite);
      if (onFinish) onFinish(post ? post.documentId : product!.documentId);
    },
    onError: (err) => {
      toast.error('Favorite update failed:' + err);
    },
  });

  const handleClick = () => {
    if (!user) toast.info('لطفا ابتدا وارد حساب کاربری شوید.');
    if (!user || clickHandlerFn.isPending) return;
    clickHandlerFn.mutate();
  };

  // if (!user) return null;

  const commonProps = {
    onClick: handleClick,
    disabled: clickHandlerFn.isPending,
    className: `flex items-center transition-transform duration-200 ${className}`,
    'aria-label': isFavorite ? 'Remove from favorites' : 'Add to favorites',
  };

  const iconClassName = `text-md ${className}`;

  if (isList) {
    return (
      <button
        onClick={handleClick}
        disabled={clickHandlerFn.isPending}
        className={`flex items-center mt-3 text-gray-600 duration-200 h-10 hover:bg-accent-pink hover:text-white transition-all ${className}`}
        // 'aria-label': isFavorite ? 'Remove from favorites' : 'Add to favorites',
      >
        {clickHandlerFn.isPending ? (
          <VscLoading className="text-accent-green animate-spin" />
        ) : (
          <IoTrash className="text-lg" />
        )}
      </button>
    );
  }

  return (
    <div className={`w-fit p-5 mb-5 ${className}`}>
      {clickHandlerFn.isPending ? (
        <VscLoading
          className={`text-accent-pink animate-spin justify-self-center ${iconClassName} ${className}`}
        />
      ) : product ? (
        <button {...commonProps}>
          {isFavorite ? (
            <div className="flex gap-2 items-center">
              <BsHeartFill
                title={'حذف از علاقه مندی ها'}
                className={`text-accent-pink/80 hover:text-accent-pink transition-colors duration-200 ${iconClassName}`}
              />
              <div className="flex items-center">
                <p className="text-xs absolute p-1 border rounded-md border-gray-300 bg-white">
                  حذف از علاقه مندی ها
                </p>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <BsHeart
                title={'اضافه به علاقه مندی ها'}
                className={`text-accent-pink/80 hover:text-accent-pink transition-colors duration-200 ${iconClassName}`}
              />
              <div className="flex items-center">
                <p className="text-xs absolute p-1 border rounded-md border-gray-300 bg-white">
                  اضافه به علاقه مندی ها
                </p>
              </div>
            </div>
          )}
        </button>
      ) : (
        <button {...commonProps}>
          {isFavorite ? (
            <div className="flex gap-2 items-center">
              <BsBookmarkFill
                title={'حذف از علاقه مندی ها'}
                className={`h-fit text-accent-pink/80 hover:text-accent-pink transition-colors duration-200  ${iconClassName}`}
              />
              <div className="flex items-center">
                <p className="text-xs absolute p-1 border rounded-md border-gray-300 bg-white">
                  حذف از علاقه مندی ها
                </p>
              </div>
            </div>
          ) : (
            <div className=" flex gap-2 items-center">
              <BsBookmark
                title={'اضافه به علاقه مندی ها'}
                className={` hover:text-red-600 transition-colors duration-200  ${iconClassName}`}
              />
              <div className="flex items-center">
                <p className="text-xs absolute p-1 border rounded-md border-gray-300 bg-white">
                  اضافه به علاقه مندی ها
                </p>
              </div>
            </div>
          )}
        </button>
      )}
    </div>
  );
}
