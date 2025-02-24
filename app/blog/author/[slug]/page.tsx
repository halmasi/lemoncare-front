import PostCard from '@/app/components/PostCard';
import { getCategoriesUrl } from '@/app/utils/data/getCategories';
import {
  getAuthorInformation,
  getGravatar,
  getPostsByAuthor,
} from '@/app/utils/data/getPosts';
import { PostsProps } from '@/app/utils/schema/blogProps/postProps';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export default async function AuthorsPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  try {
    const getPosts = await getPostsByAuthor(slug);
    const getAuthor = await getAuthorInformation(getPosts[0].author.documentId);
    const gravatar = await getGravatar(getAuthor.email);
    return (
      <main className="flex flex-col container max-w-screen-xl py-5 px-10 space-y-2">
        <div className="w-full flex flex-col md:flex-row gap-5 items-center border-2 rounded-2xl bg-white p-2">
          <Image
            src={`https://0.gravatar.com/avatar/${gravatar.hash}?size=512`}
            alt=""
            width={500}
            height={500}
            priority
            className="w-[50svw] md:w-52 md:h-52 aspect-square rounded-full ml-3"
          />
          <div className="flex flex-col text-center md:text-right justify-start h-full">
            <h2 className="text-accent-pink">{getAuthor.name}</h2>
            <p className="flex flex-wrap">{getAuthor.description}</p>
          </div>
        </div>
        <div className="grid grid-flow-row grid-cols-1 md:grid-cols-3 gap-3">
          {getPosts.map(async (post: PostsProps) => {
            post.categoryUrl = await getCategoriesUrl(post.category, [
              'category',
            ]);
            return (
              <PostCard
                key={post.documentId}
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
    );
  } catch (error) {
    console.log(error);
    return notFound();
  }
}
