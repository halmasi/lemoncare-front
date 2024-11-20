import Content from '@/components/Content';
import MainSection from '@/components/MainSection';
import { dataFetch } from '@/utils/data/dataFetch';
import { ContentProps } from '@/utils/data/getPosts';
import qs from 'qs';
import React from 'react';

export default async function privacypolicy({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const query = qs.stringify({
    filters: { slug: { $eq: slug } },
    populate: '*',
  });

  interface SinglePageProps {
    id: number;
    title: string;
    slug: string;
    content: ContentProps[];
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }

  const apiData: SinglePageProps[] = await dataFetch(`/single-pages?${query}`);
  const content = apiData[0];
  return (
    <MainSection>
      <h1>{content.title}</h1>
      {content.content.map((item: ContentProps, index: number) => (
        <Content key={index} props={item} />
      ))}
    </MainSection>
  );
}
