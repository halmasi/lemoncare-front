import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import { getCategory } from '@/app/utils/data/getCategories';
import { getPostsByCategory } from '@/app/utils/data/getPosts';
import { PostsProps } from '@/app/utils/schema/blogProps';
import PostCard from '@/app/components/PostCard';
import { Suspense } from 'react';

// export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const fetchCategory = await getCategory(slug[slug.length - 1]);
  if (fetchCategory && fetchCategory.length < 1) return notFound();
  const category = fetchCategory[0];

  return {
    title: category.title + ' | Lemoncare - لمن کر',
    description: category.description,
    authors: [
      {
        name: 'Lemoncare - لمن کر',
        url: `https://lemoncare.ir/`,
      },
    ],
    applicationName: 'lemoncare - لمن کر',
    category: category.title + ' | Lemoncare - لمن کر',
    openGraph: {
      title: category.title + ' | Lemoncare - لمن کر',
      description: category.description,
      siteName: 'لمن کر - lemoncare',
    },
  };
}

export default async function Category({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const slug = (await params).slug;
  const category = await getCategory(slug[slug.length - 1]);
  const posts = await getPostsByCategory(category[0]);

  if (!posts || category.length < 1 || posts.length < 1) return notFound();

  return (
    <main
      className="flex flex-col container max-w-screen-xl py-5 px-10 space-y-2"
      key={Math.random()}
    >
      <div className="grid grid-flow-row grid-cols-1 md:grid-cols-3 gap-3">
        <Suspense
          fallback={<div className="w-10 h-10 bg-gray-900 animate-pulse" />}
        >
          {posts.map((post: PostsProps) => {
            return (
              <PostCard
                key={post.documentId}
                basicInfo={post.basicInfo}
                category={post.category}
                seo={post.seo}
                authorEmail={post.author.email}
                authorName={post.author.name}
                authorSlug={post.author.username}
              />
            );
          })}
        </Suspense>
      </div>
    </main>
  );
}
