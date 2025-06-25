import { getPosts } from '@/app/utils/data/getPosts';
import PostCard from '@/app/components/PostCard';
import { getSlides } from '../utils/data/getSuggestions';
import Slide from '../components/Slide';
import { PostsProps } from '@/app/utils/schema/blogProps';

export default async function BlogHomePage() {
  const slide = await getSlides('blog');

  const data = await getPosts(3, ['post']);

  return (
    <article className="w-full flex flex-col items-center">
      <div className="py-5 px-2">
        <Slide media={slide.medias} />
      </div>

      <main className="flex flex-col container max-w-screen-xl py-5 px-10 space-y-2">
        <div className="grid grid-flow-row grid-cols-1 md:grid-cols-3 gap-3">
          {data.map((post: PostsProps) => {
            return (
              <PostCard
                key={post.documentId + 'post'}
                basicInfo={post.basicInfo}
                category={post.category}
                seo={post.seo}
                authorEmail={post.author.email}
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
