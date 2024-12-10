import Content from '@/components/Content';
import MainSection from '@/components/MainSection';
import { ContentProps, getPost } from '@/utils/data/getPosts';
import Breadcrumbs from '@/components/Breadcrumbs';
import Image from 'next/image';
import { LuCalendarClock } from 'react-icons/lu';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = params;
  const data = await getPost(slug);
  if (!data.length) return notFound();
  const post = data[0];
  const previousImages = (await parent).openGraph?.images || [];
  let tags = post.tags.map((item) => item.title).join('، ');
  return {
    title: post.seo.seoTitle + ' | Lemoncare - لمن کر',
    description: post.seo.seoDescription + '\n برچسب ها: ' + tags,
    authors: [
      {
        name: post.author.name,
        url: `https://lemoncare.ir/author/${post.author.username}`,
      },
    ],
    applicationName: 'lemoncare - لمن کر',
    category: post.category.title + ' | Lemoncare - لمن کر',
    openGraph: {
      title: post.seo.seoTitle + ' | Lemoncare - لمن کر',
      description: post.seo.seoDescription,
      siteName: 'لمن کر - lemoncare',
      images: [post.basicInfo.mainImage.formats.medium.url, ...previousImages],
    },
  };
}

export default async function page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const data = await getPost(slug);
  if (!data.length) return notFound();
  const post = data[0];
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
              href={`/tags/${tag.slug}`}
            >
              {tag.title}
            </Link>
          ))}
        </div>
      )}
    </MainSection>
  );
}
