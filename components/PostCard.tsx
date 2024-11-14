import { CategoriesProps, ImageProps } from '@/utils/data/getPosts';
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
  authorName,
  authorSlug,
}: {
  category: CategoriesProps;
  basicInfo: { title: string; mainImage: ImageProps; contentCode: number };
  seo: { seoDescription: string };
  gravatar: { avatar_url: string };
  categoryUrl: string;
  authorName: string;
  authorSlug: string;
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

          <Link
            className="flex items-center text-gray-600"
            href={`author/${authorSlug}`}
          >
            <Image
              src={gravatar.avatar_url}
              alt=""
              width={100}
              height={100}
              className="w-10 aspect-square rounded-full ml-3"
            />
            <p>{authorName}</p>
          </Link>
          <Link
            className="flex justify-center items-center mt-3 px-3 rounded-lg transition-all text-gray-700 hover:text-green-700  bg-yellow-400 w-fit" //hover:shadow-[rgba(200,0,100,0.9)_0px_0px_5px_1px]
            href={'/posts/' + basicInfo.contentCode}
          >
            <p>ادامه مطلب ...</p>
            <IoMdArrowDropleft />
          </Link>
        </div>
      </div>
    </div>
  );
}
