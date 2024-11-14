import { CategoriesProps, ImageProps } from '@/utils/getPosts';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { IoMdArrowDropleft } from 'react-icons/io';

export default function PostCard({
  category,
  categoryUrl,
  basicInfo,
  seo,
  gravatar,
}: {
  category: CategoriesProps;
  basicInfo: { title: string; mainImage: ImageProps; contentCode: number };
  seo: { seoDescription: string };
  gravatar: { avatar_url: string };
  categoryUrl: string;
}) {
  return (
    <div>
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
    </div>
  );
}
