import { getPosts, PostsProps } from '@/utils/getPosts';
import PostsSkeleton from '@/components/Skeleton';
import PostCard from '@/components/PostCard';
import { Suspense } from 'react';

export default async function Home() {
  const data = await getPosts(3);
  return (
    <main className="container max-w-screen-xl py-5 px-10">
      <div className="grid grid-flow-row grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          {data.map((post: PostsProps) => (
            <Suspense key={post.documentId} fallback={<PostsSkeleton />}>
              <PostCard
                basicInfo={post.basicInfo}
                category={post.category}
                seo={post.seo}
              />
            </Suspense>
          ))}
        </div>
      </div>
    </main>
  );
}
