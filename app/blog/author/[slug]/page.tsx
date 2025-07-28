import ProductAndBlogSkeleton from '@/app/components/ProductAndBlogSkeleton';
import ProductsAndBlogPage from '@/app/components/ProductsAndBlogPage';
import { getAuthorInformation } from '@/app/utils/data/getPosts';
import { getGravatar } from '@/app/utils/data/getUserInfo';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export default async function AuthorsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | undefined }>;
}) {
  const slug = (await params).slug;
  const searchParam = await searchParams;
  const page = parseInt(searchParam?.p || '1');

  const author = await getAuthorInformation(slug);
  if (!author) return notFound();
  const gravatar = await getGravatar(author.email);

  return (
    <main className="flex flex-col container max-w-screen-xl py-5 px-10 space-y-2">
      {author ? (
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
            <h2 className="text-accent-pink">{author.name}</h2>
            <p className="flex flex-wrap">{author.description}</p>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col md:flex-row gap-5 items-center rounded-2xl bg-gray-300 p-2 animate-pulse">
          <div className="w-[50svw] md:w-52 md:h-52 aspect-square rounded-full ml-3 bg-gray-500" />
          <div className="flex flex-col w-full gap-2 bg-gray-300 justify-start h-full">
            <div className="bg-gray-500 w-[50%] h-[50%] p-1 rounded-lg" />
            <div className="bg-gray-500 w-[80%] h-[12%] rounded-lg" />
            <div className="bg-gray-500 w-[80%] h-[12%] rounded-lg" />
            <div className="bg-gray-500 w-[80%] h-[12%] rounded-lg" />
            <div className="bg-gray-500 w-[80%] h-[12%] rounded-lg" />
          </div>
        </div>
      )}
      {slug ? (
        <ProductsAndBlogPage
          resultBy="author"
          slug={[slug]}
          type="post"
          page={page}
        />
      ) : (
        <div className="grid grid-flow-row grid-cols-1 md:grid-cols-3 gap-3">
          <ProductAndBlogSkeleton count={10} />
        </div>
      )}
    </main>
  );
}
