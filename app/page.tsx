import MainSection from '@/components/MainSection';
import {
  getCategoriesUrl,
  getGravatar,
  getPosts,
  PostsProps,
} from '@/utils/data/getPosts';
const PostsSkeleton = dynamic(() => import('@/components/Skeleton'));
const PostCard = dynamic(() => import('@/components/PostCard'), {
  ssr: false,
  loading: () => <PostsSkeleton />,
});

import dynamic from 'next/dynamic';

export default async function Home() {
  const data = await getPosts(3);

  return (
    <MainSection>
      <div className="grid grid-flow-row grid-cols-1 md:grid-cols-3 gap-3">
        {data.map(async (post: PostsProps) => {
          post.categoryUrl = await getCategoriesUrl(post.category);
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
    </MainSection>
  );
}
