import { getCategoriesUrl, getCategory } from '@/utils/data/getCategories';
import {
  getGravatar,
  getPostsByCategory,
  PostsProps,
} from '@/utils/data/getPosts';
const PostsSkeleton = dynamic(() => import('@/components/Skeleton'));
const PostCard = dynamic(() => import('@/components/PostCard'), {
  ssr: false,
  loading: () => <PostsSkeleton />,
});

import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

export default async function Category({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const slug = (await params).slug;
  const category = await getCategory(slug[slug.length - 1], ['category']);
  const posts = await getPostsByCategory(category[0], ['category']);

  if (category.length < 1 || posts.length < 1) return notFound();

  return (
    <main className="flex flex-col container max-w-screen-xl py-5 px-10 space-y-2">
      <div className="grid grid-flow-row grid-cols-1 md:grid-cols-3 gap-3">
        {posts.map(async (post: PostsProps) => {
          post.categoryUrl = await getCategoriesUrl(post.category, [
            'category',
          ]);
          post.gravatar = await getGravatar(post.author.email);
          return (
            <PostCard
              key={post.documentId}
              basicInfo={post.basicInfo}
              category={post.category}
              seo={post.seo}
              categoryUrl={post.categoryUrl}
              gravatar={post.gravatar}
              authorName={post.author.name}
              authorSlug={post.author.username}
            />
          );
        })}
      </div>
    </main>
  );
}
