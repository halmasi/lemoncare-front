'use client';

import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { getFavorites } from '@/app/utils/data/getUserInfo';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { toast } from 'react-toastify';
import { PostsProps } from '@/app/utils/schema/blogProps';
import Title from '@/app/components/Title';
import Pagination from '@/app/components/Pagination';
import { useSearchParams } from 'next/navigation';
import FavoriteSkeleton from '@/app/components/profile/FavoriteSkeleton';
import Link from 'next/link';
import Image from 'next/image';
import SubmitButton from '@/app/components/formElements/SubmitButton';
import AddToFavorites from '@/app/components/AddToFavorites';
import { FaArrowRightLong } from 'react-icons/fa6';

export default function Bookmarks() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('p') || '1');
  const pageSize = 12;
  const numbersArray = Array.from(
    { length: pageSize },
    (_, i) => i + (page * pageSize - pageSize)
  );

  const { user } = useDataStore();
  const [favoritesData, setFavoritesData] = useState<PostsProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getFavoritesFn = useMutation({
    mutationFn: async (documentId: string) => {
      const res = await getFavorites(documentId, 'posts');
      const data: PostsProps[] = res.data.posts;
      return data;
    },
    onSuccess: (data) => {
      setLoading(false);
      if (!data) return;
      setFavoritesData(data);
    },
    onError: () => {
      setLoading(false);
      toast.error('خطایی رخ داده');
    },
  });

  useEffect(() => {
    if (user && user.favorite) {
      getFavoritesFn.mutate(user.favorite.documentId);
    }
  }, [user]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row w-full">
        <Link
          href={'/dashboard'}
          className="absolute hover:text-accent-pink self-start md:self-center md:justify-self-start transition-colors w-fit p-2 border-l"
        >
          <FaArrowRightLong />
        </Link>
        <div className="w-full flex flex-col items-center justify-center text-center mb-5">
          <Title className="flex flex-col items-center justify-center text-center mb-6">
            <h6 className="text-accent-pink">مقالات نشان شده من</h6>
          </Title>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-wrap max-w-screen-lg gap-5 justify-center">
          {numbersArray.map((item) => (
            <FavoriteSkeleton key={item} />
          ))}
        </div>
      ) : favoritesData && favoritesData.length > 0 ? (
        <div className="flex flex-wrap justify-center max-w-screen-lg gap-5">
          {numbersArray.map((index) => {
            if (favoritesData[index])
              return (
                <div
                  key={index}
                  className="flex flex-col gap-2 items-center p-1 w-48 h-fit rounded-lg border"
                >
                  <Link
                    href={
                      '/blog/posts/' +
                      favoritesData[index].basicInfo.contentCode
                    }
                    className="flex flex-col gap-2 items-center p-1"
                  >
                    <Image
                      width={
                        favoritesData[index].basicInfo.mainImage.formats
                          .thumbnail.width
                      }
                      height={
                        favoritesData[index].basicInfo.mainImage.formats
                          .thumbnail.height
                      }
                      src={
                        favoritesData[index].basicInfo.mainImage.formats
                          .thumbnail.url
                      }
                      alt={favoritesData[index].basicInfo.title}
                      className="w-[95%] h-32 object-cover rounded-lg gap-2"
                    />
                    <p className="text-accent-pink">
                      {favoritesData[index].basicInfo.title}
                    </p>
                    <SubmitButton
                      title={''}
                      className="w-fit h-10 items-center px-[7px] py-0 text-xs gap-1"
                    >
                      <p className="font-semibold">مشاهده مقاله</p>
                    </SubmitButton>
                  </Link>
                  <div className="flex items-center gap-2">
                    <AddToFavorites
                      onFinish={() => {
                        getFavoritesFn.mutate(user!.favorite.documentId);
                      }}
                      className="h-fit mb-3 p-2 rounded-lg border border-gray-400/75"
                      isList
                      post={favoritesData[index]}
                    />
                  </div>
                </div>
              );
          })}
          <Pagination
            currentPage={page}
            pageCount={Math.round(favoritesData.length / pageSize + 0.5)}
            query="p"
          />
        </div>
      ) : (
        <div className="w-full flex flex-col gap-3 items-center">
          <p className="">مقاله ای در لیست شما وجود ندارد!</p>
          <SubmitButton
            link="/blog"
            className="bg-pink-500 text-white hover:bg-pink-600"
          >
            برو به صفحه مقالات
          </SubmitButton>
        </div>
      )}
    </div>
  );
}
