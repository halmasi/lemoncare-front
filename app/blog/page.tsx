import { getCategoriesUrl } from '@/app/utils/data/getCategories';
import { getPosts } from '@/app/utils/data/getPosts';
const PostsSkeleton = dynamic(() => import('@/app/components/Skeleton'));
const PostCard = dynamic(() => import('@/app/components/PostCard'), {
  ssr: false,
  loading: () => <PostsSkeleton />,
});

import dynamic from 'next/dynamic';
import { getSlides } from '../utils/data/getSuggestions';
import Slide from '../components/Slide';
import { PostsProps } from '../utils/schema/blogProps/postProps';

export default async function Home() {
  const slide = await getSlides('blog');

  const data = await getPosts(3, ['post']);

  return (
    <article className="w-full flex flex-col items-center">
      <div className="py-5 px-2">
        <Slide media={slide.medias} />
      </div>

      <main className="flex flex-col container max-w-screen-xl py-5 px-10 space-y-2">
        <div className="grid grid-flow-row grid-cols-1 md:grid-cols-3 gap-3">
          {data.map(async (post: PostsProps) => {
            post.categoryUrl = await getCategoriesUrl(post.category, [
              'category',
            ]);
            const get = await fetch(
              process.env.SITE_URL + '/api/auth/gravatar',
              {
                headers: {
                  'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({ email: post.author.email }),
              }
            );

            const gravatarJson = await get.json();
            const gravatar = JSON.parse(gravatarJson).data;
            return (
              <PostCard
                key={post.documentId + 'post'}
                basicInfo={post.basicInfo}
                category={post.category}
                seo={post.seo}
                categoryUrl={post.categoryUrl}
                gravatar={gravatar}
                authorName={post.author.name}
                authorSlug={post.author.username}
              />
            );
          })}
        </div>
      </main>
    </article>
  );
}
