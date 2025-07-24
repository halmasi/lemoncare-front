'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { IoMdArrowDropleft } from 'react-icons/io';
import { CategoriesProps } from '@/app/utils/schema/blogProps';
import { ImageProps } from '@/app/utils/schema/mediaProps';
import Gravatar from './profile/Gravatar';
import { useMutation } from '@tanstack/react-query';
import { getCategoriesUrl } from '../utils/data/getCategories';

export default function PostCard({
  category,
  categoryUrl,
  basicInfo,
  seo,
  authorName,
  authorSlug,
  authorEmail,
  isSlide,
}: {
  category: CategoriesProps;
  basicInfo: { title: string; mainImage: ImageProps; contentCode: number };
  seo: { seoDescription: string };
  categoryUrl?: string;
  authorName?: string;
  authorSlug?: string;
  authorEmail?: string;
  isSlide?: boolean;
}) {
  const [categoryFetchUrl, setCategoryFetchUrl] = useState<string>();
  const getCategoryFn = useMutation({
    mutationFn: async () => {
      return await getCategoriesUrl(category, ['category']);
    },
    onSuccess: (data) => {
      setCategoryFetchUrl(data);
    },
  });

  useEffect(() => {
    if (categoryUrl) {
      setCategoryFetchUrl(categoryUrl);
    } else {
      getCategoryFn.mutate();
    }
  }, []);

  return (
    <article>
      {categoryFetchUrl ? (
        <div className="flex items-center text-gray-600 text-sm">
          <p>دسته بندی</p> <IoMdArrowDropleft />
          <Link href={'/blog/category/' + categoryFetchUrl}>
            {category.title}
          </Link>
        </div>
      ) : (
        <div className="w-[50%] h-5 bg-gray-500 animate-pulse m-2 rounded-lg" />
      )}
      <div className="flex flex-col bg-white shadow-lg rounded-lg">
        <div
          className={`w-full overflow-hidden ${isSlide ? 'rounded-lg' : 'rounded-t-lg'}`}
        >
          <Link
            className="flex flex-col justify-end"
            href={'/blog/posts/' + basicInfo.contentCode}
          >
            <Suspense
              fallback={
                <div
                  className={`object-cover ${isSlide ? 'rounded-lg' : 'rounded-t-lg'} w-full min-h-[15rem] bg-gray-600`}
                />
              }
            >
              <Image
                src={basicInfo.mainImage.formats.small.url}
                alt={
                  basicInfo.mainImage.alternativeText ||
                  basicInfo.mainImage.name
                }
                height={basicInfo.mainImage.formats.small.height}
                width={basicInfo.mainImage.formats.small.width}
                className={`object-cover ${isSlide ? 'rounded-lg' : 'rounded-t-lg'} w-full min-h-[15rem] hover:scale-105 transition-transform duration-200`}
              />
            </Suspense>
            <h6 className="absolute text-white bg-black/30 rounded-xl w-fit px-3">
              {basicInfo.title}
            </h6>
          </Link>
        </div>
        {!isSlide && (
          <div className="p-2">
            <p>{seo.seoDescription}</p>
            {authorName && authorSlug && (
              <Link
                className="flex items-center text-gray-600 gap-1"
                href={`/blog/author/${authorSlug}`}
              >
                <Gravatar emailAddress={authorEmail} />
                <p>{authorName}</p>
              </Link>
            )}

            <Link
              className="flex justify-center items-center mt-3 px-3 rounded-lg transition-all text-gray-700 hover:text-green-700  bg-yellow-400 w-fit" //hover:shadow-[rgba(200,0,100,0.9)_0px_0px_5px_1px]
              href={'/blog/posts/' + basicInfo.contentCode}
            >
              <p>ادامه مطلب ...</p>
              <IoMdArrowDropleft />
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
