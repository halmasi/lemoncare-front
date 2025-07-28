import Content from '@/app/components/Content';
import MainSection from '@/app/components/MainSection';
import { getPost } from '@/app/utils/data/getPosts';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import Image from 'next/image';
import { LuCalendarClock } from 'react-icons/lu';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ContentProps } from '@/app/utils/schema/otherProps';
import AddToFavorites from '@/app/components/AddToFavorites';

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const { slug } = params;
  const data = await getPost(slug);
  if (!data.length) return notFound();
  const post = data[0];
  const previousImages = (await parent).openGraph?.images || [];
  const tags =
    post.tags && post.tags.length > 0
      ? post.tags.map((item) => item.title).join('، ')
      : [''];
  return {
    title: post.seo.seoTitle + ' | lemiro - لمیرو',
    description: post.seo.seoDescription + '\n برچسب ها: ' + tags,
    authors: [
      {
        name: post.author.name,
        url: `https://lemiro.ir/author/${post.author.username}`,
      },
    ],
    applicationName: 'lemiro - لمیرو',
    category: post.category.title + ' | lemiro - لمیرو',
    openGraph: {
      title: post.seo.seoTitle + ' | lemiro - لمیرو',
      description: post.seo.seoDescription,
      siteName: 'lemiro - لمیرو',
      images: [post.basicInfo.mainImage.formats.medium.url, ...previousImages],
    },
  };
}

export default async function page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const { slug } = params;
  const data = await getPost(slug);
  if (!data.length) return notFound();
  const post = data[0];
  if (!post.content.length) return notFound();
  const contents: ContentProps[] = post.content;
  const publishDate = new Date(post.createdAt);
  return (
    <MainSection>
      <div className="flex flex-col md:flex-row w-full justify-center md:justify-between">
        <Breadcrumbs post={post} />
        <hr className="md:hidden w-full" />
        <p className="flex flex-row items-center">
          تاریخ انتشار
          <LuCalendarClock className="ml-3" />
          {publishDate.toLocaleString('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      <h1 className="text-center text-green-700">{post.basicInfo.title}</h1>
      <AddToFavorites post={post} />
      <Image
        className="rounded-lg overflow-hidden shadow-[rgb(234,179,8,0.6)_5px_5px_10px_0px,rgb(21,128,61,0.6)_-5px_-5px_10px_0px]"
        src={post.basicInfo.mainImage.url}
        alt={
          post.basicInfo.mainImage.alternativeText ||
          post.basicInfo.mainImage.name
        }
        width={post.basicInfo.mainImage.width}
        height={post.basicInfo.mainImage.height}
      />
      {contents.map((item: ContentProps, index: number) => (
        <Content key={index} props={item} />
      ))}
      {post.sources && (
        <div className="flex flex-wrap gap-2 bg-gray-200 items-center w-fit px-2">
          <p>منبع</p>
          {post.sources.map((source) => (
            <a
              className="px-2 rounded-full border bg-white border-gray-800 w-fit hover:bg-yellow-500 text-gray-600 transition-colors"
              key={source.id}
              target="_blank"
              href={source.sourceUrl}
            >
              {source.websiteName}
            </a>
          ))}
        </div>
      )}
      {post.tags && (
        <div className="flex flex-wrap gap-2 bg-gray-200 items-center w-fit px-2">
          <p>برچسب ها</p>
          {post.tags.map((tag) => (
            <Link
              className="px-2 rounded-full border bg-white border-gray-800 w-fit hover:bg-yellow-500 text-gray-600 transition-colors"
              key={tag.id}
              href={`/blog/tags/${tag.slug}`}
            >
              {tag.title}
            </Link>
          ))}
        </div>
      )}
    </MainSection>
  );
}
