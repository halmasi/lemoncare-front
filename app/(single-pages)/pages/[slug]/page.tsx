import Content from '@/app/components/Content';
import MainSection from '@/app/components/MainSection';
import Title from '@/app/components/Title';
import config from '@/app/utils/config';
import { dataFetch } from '@/app/utils/data/dataFetch';
import { ContentProps } from '@/app/utils/schema/otherProps';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import qs from 'qs';
import React, { cache } from 'react';
import Logo from '@/public/lemiroLogoForHeader.png';

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

  const res = await dataFetch({
    qs: `/single-pages?${query}`,
  });
  const apiData: SinglePageProps = res.data[0];
  return apiData;
});

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
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
    title: post.title + ' | lemiro - لمیرو',
    description,
    authors: [
      {
        name: 'lemiro - لمیرو',
        url: 'https://lemiro.ir',
      },
    ],
    applicationName: 'lemiro - لمیرو',
    openGraph: {
      title: post.title + ' | lemiro - لمیرو',
      description,
      siteName: 'lemiro - لمیرو',
      images: [
        {
          url: `${config.siteUrl}${Logo.src}`,
          width: 1200,
          height: 630,
          alt: 'lemiro - لمیرو',
        },
      ],
    },
  };
}

export default async function SinglePage(props0: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props0.params;
  const { slug } = params;
  const content: SinglePageProps = await getPage(slug);

  if (!content) return notFound();
  return (
    <MainSection>
      <Title underLineClass="bg-accent-pink" className="mb-10">
        <h2>{content.title}</h2>
      </Title>
      {content.content.map((item: ContentProps, index: number) => (
        <section key={index}>
          <Content props={item} />
        </section>
      ))}
    </MainSection>
  );
}
