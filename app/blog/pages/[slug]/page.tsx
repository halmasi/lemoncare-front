import Content from '@/components/Content';
import MainSection from '@/components/MainSection';
import { dataFetch } from '@/utils/data/dataFetch';
import { ContentProps } from '@/utils/data/getPosts';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import qs from 'qs';
import React, { cache } from 'react';
interface SinglePageProps {
  id: number;
  title: string;
  slug: string;
  content: ContentProps[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

const getPage = cache(async function (slug: string) {
  const query = qs.stringify({
    filters: { slug: { $eq: slug } },
    populate: '*',
  });

  const apiData: SinglePageProps[] = await dataFetch(`/single-pages?${query}`);
  return apiData[0];
});

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;

  const post = await getPage(slug);
  if (!post) return notFound();
  const description = post.content
    .filter((item) => item.type === 'paragraph')
    .map((item) =>
      item.children
        .map((child) => ('text' in child ? child.text : ''))
        .join(' ')
    )
    .join(' ')
    .slice(0, 150);

  return {
    title: post.title + ' | Lemoncare - لمن کر',
    description,
    authors: [
      {
        name: 'Lemoncare',
        url: 'https://lemoncare.ir',
      },
    ],
    applicationName: 'Lemoncare - لمن کر',
    openGraph: {
      title: post.title + ' | Lemoncare - لمن کر',
      description,
      siteName: 'لمن کر - Lemoncare',
    },
  };
}

export default async function SinglePage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const content: SinglePageProps = await getPage(slug);

  if (!content) return notFound();
  return (
    <MainSection>
      <h1>{content.title}</h1>
      {content.content.map((item: ContentProps, index: number) => (
        <Content key={index} props={item} />
      ))}
    </MainSection>
  );
}