import {
  getCategoriesUrl,
  getGravatar,
  getPosts,
  PostsProps,
} from '@/utils/getPosts';
const PostsSkeleton = dynamic(() => import('@/components/Skeleton'));
const PostCard = dynamic(() => import('@/components/PostCard'), {
  ssr: false,
  loading: () => <PostsSkeleton />,
});

import dynamic from 'next/dynamic';

export default async function Home() {
  const data = await getPosts(3);

  return (
    <main className="container max-w-screen-xl py-5 px-10">
      <div className="grid grid-flow-row grid-cols-1 md:grid-cols-3 gap-3">
        {data.map(async (post: PostsProps) => {
          post.categoryUrl = await getCategoriesUrl(post.category);
          post.gravatar = await getGravatar('h.almasi2012@gmail.com');
          return (
            <PostCard
              key={post.documentId}
              basicInfo={post.basicInfo}
              category={post.category}
              seo={post.seo}
              categoryUrl={post.categoryUrl}
              gravatar={post.gravatar}
            />
          );
        })}
      </div>
    </main>
  );
}
