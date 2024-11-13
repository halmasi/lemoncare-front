import { getPosts, PostsProps } from '@/utils/getPosts';
import PostsSkeleton from '@/components/Skeleton';
import PostCard from '@/components/PostCard';
import { Suspense } from 'react';

export default async function Home() {
  const data = await getPosts();
  return (
    <main className="container max-w-screen-xl py-5 px-10">
      <div className="grid grid-flow-row grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          {data.map((post) => (
            <Suspense key={post.documentId} fallback={<PostsSkeleton />}>
              <div className="flex flex-col bg-gray-200 p-2 rounded-lg animate-pulse duration-50 space-y-2">
                <div className="w-full flex flex-col justify-end space-y-2 p-3 bg-gray-500 rounded-lg h-[200px]">
                  {post.basicInfo.title}
                </div>
                <p>{post.basicInfo.contentCode}</p>
                <p>{post.seo.seoDescription}</p>
                <div className="flex items-center">
                  <div className="w-8 rounded-full bg-gray-500 aspect-square" />
                </div>
              </div>
            </Suspense>
          ))}
        </div>
      </div>
    </main>
  );
}
