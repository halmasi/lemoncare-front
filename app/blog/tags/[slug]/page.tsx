import PostCard from '@/app/components/PostCard';
import { getCategoriesUrl } from '@/app/utils/data/getCategories';
import {
  getGravatar,
  getPostsByTag,
  PostsProps,
} from '@/app/utils/data/getPosts';

export default async function page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const posts: PostsProps[] = await getPostsByTag(slug);

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
