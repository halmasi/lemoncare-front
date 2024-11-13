import {
  CategoriesProps,
  getCategoriesUrl,
  ImageProps,
  PostsProps,
} from '@/utils/getPosts';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { IoMdArrowDropleft } from 'react-icons/io';
import { createHash } from 'crypto';

export default async function PostCard({
  category,
  basicInfo,
  seo,
}: {
  category: CategoriesProps;
  basicInfo: { title: string; mainImage: ImageProps; contentCode: number };
  seo: { seoDescription: string };
}) {
  const categoryUrl = await getCategoriesUrl(category);

  const fetchGravatar = await fetch(
    process.env.GRAVATAR_URI +
      createHash('sha256').update('h.almasi2012@gmail.com').digest('hex'),
    {
      headers: {
        Authorization: 'Bearer ' + process.env.GRAVATAR_SECRET,
      },
    }
  );
  const gravatar = await fetchGravatar.json();
  return (
    <>
      <div className="flex items-center text-gray-600 text-sm">
        <p>دسته بندی</p> <IoMdArrowDropleft />
        <Link href={'/categories/' + categoryUrl}>{category.title}</Link>
      </div>
      <div className="flex flex-col bg-white shadow-lg rounded-lg">
        <div className="w-full overflow-hidden rounded-t-lg">
          <Link
            className="flex flex-col justify-end"
            href={'/posts/' + basicInfo.contentCode}
          >
            <Suspense
              fallback={
                <div className="object-cover rounded-t-lg w-full min-h-[15rem] bg-gray-600" />
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
                className="object-cover rounded-t-lg w-full min-h-[15rem] hover:scale-105 transition-transform duration-200"
              />
            </Suspense>
            <h6 className="absolute text-white bg-black/30 rounded-xl w-fit px-3">
              {basicInfo.title}
            </h6>
          </Link>
        </div>
        <div className="p-2">
          <p>{seo.seoDescription}</p>
          <div className="flex items-center">
            <Image
              src={gravatar.avatar_url}
              alt=""
              width={100}
              height={100}
              className="w-10 aspect-square rounded-full"
            />
          </div>
        </div>
      </div>
    </>
  );
}
