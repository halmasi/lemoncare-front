import PostCard from '@/app/components/PostCard';
import { getPostsByTag } from '@/app/utils/data/getPosts';
import { PostsProps } from '@/app/utils/schema/blogProps';

export default async function page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { slug } = params;
  const posts: PostsProps[] = await getPostsByTag(slug);

  return (
    <main className="flex flex-col container max-w-screen-xl py-5 px-10 space-y-2">
      <div className="grid grid-flow-row grid-cols-1 md:grid-cols-3 gap-3">
        {posts.map(async (post: PostsProps) => {
          return (
            <PostCard
              key={post.documentId}
              basicInfo={post.basicInfo}
              category={post.category}
              seo={post.seo}
              authorName={post.author.name}
              authorSlug={post.author.username}
              authorEmail={post.author.email}
            />
          );
        })}
      </div>
    </main>
  );
}
