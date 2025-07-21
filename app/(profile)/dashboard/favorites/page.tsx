'use client';

import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { getFavorites } from '@/app/utils/data/getUserInfo';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { useSearchParams } from 'next/navigation';
import Title from '@/app/components/Title';
import { ProductProps } from '@/app/utils/schema/shopProps';
import SubmitButton from '@/app/components/formElements/SubmitButton';
import Toman from '@/app/components/Toman';
import AddToFavorites from '@/app/components/AddToFavorites';
import { lowestPrice } from '@/app/utils/shopUtils';
import Pagination from '@/app/components/Pagination';
import { toast } from 'react-toastify';
import FavoriteSkeleton from '@/app/components/profile/FavoriteSkeleton';
import Link from 'next/link';
import Image from 'next/image';

export default function Favorites() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('p') || '1');
  const pageSize = 12;
  const numbersArray = Array.from(
    { length: pageSize },
    (_, i) => i + (page * pageSize - pageSize)
  );
  const { user } = useDataStore();
  const [favoritesData, setFavoritesData] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getFavoritesFn = useMutation({
    mutationFn: async (documentId: string) => {
      const res = await getFavorites(documentId, 'products');
      const data: ProductProps[] = res.data.products;
      return data;
    },
    onSuccess: (data) => {
      if (!data) return;
      setFavoritesData(data);
    },
    onError: () => {
      toast.error('خطایی رخ داده');
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  useEffect(() => {
    if (user && user.favorite)
      getFavoritesFn.mutateAsync(user.favorite.documentId);
  }, [user]);
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <Title className="mb-5">
        <h6 className="text-accent-pink">محصولات مورد علاقه من</h6>
      </Title>

      {loading ? (
        <div className="flex flex-wrap max-w-screen-lg gap-5 justify-center">
          {numbersArray.map((item) => (
            <FavoriteSkeleton key={item} />
          ))}
        </div>
      ) : favoritesData.length > 0 ? (
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
                      '/shop/product/' +
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
                      <p className="font-semibold">مشاهده محصول</p>
                    </SubmitButton>
                  </Link>
                  <div className="flex items-center gap-2">
                    <Toman className="fill-accent-green text-accent-green">
                      {(
                        lowestPrice(favoritesData[index]).price / 10
                      ).toLocaleString('fa-IR')}
                    </Toman>
                    <AddToFavorites
                      onFinish={(id) => {
                        getFavoritesFn.mutateAsync(user!.favorite.documentId);
                      }}
                      className="h-fit mb-3 p-2 rounded-lg border border-gray-400/75"
                      isList
                      product={favoritesData[index]}
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
          <p className="">محصولی در لیست شما وجود ندارد!</p>
          <SubmitButton
            link="/shop"
            className="bg-pink-500 text-white hover:bg-pink-600"
          >
            برو به صفحه محصولات
          </SubmitButton>
        </div>
      )}
    </div>
  );
}
