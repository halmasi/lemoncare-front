import PostCard from '@/app/components/PostCard';
import {
  getAuthorInformation,
  getPostsByAuthor,
} from '@/app/utils/data/getPosts';
import { getGravatar } from '@/app/utils/data/getUserInfo';
import { PostsProps } from '@/app/utils/schema/blogProps';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export default async function AuthorsPage(
  props: {
    params: Promise<{ slug: string }>;
  }
) {
  const params = await props.params;
  const { slug } = params;
  try {
    const getPosts = await getPostsByAuthor(slug);
    const getAuthor = await getAuthorInformation(getPosts[0].author.documentId);
    const gravatar = await getGravatar(getAuthor.email);

    return (
      <main className="flex flex-col container max-w-screen-xl py-5 px-10 space-y-2">
        <div className="w-full flex flex-col md:flex-row gap-5 items-center border-2 rounded-2xl bg-white p-2">
          <Image
            src={`${gravatar}?size=512`}
            alt="gravatar"
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
          {getPosts.map((post: PostsProps) => {
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
  } catch (error) {
    console.log(error);
    return notFound();
  }
}
