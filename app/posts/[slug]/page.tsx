import Content from '@/components/Content';
import MainSection from '@/components/MainSection';
import { ContentProps, getPost } from '@/utils/data/getPosts';
import Image from 'next/image';

export default async function page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const data = await getPost(slug);
  const post = data[0];
  const contents: ContentProps[] = post.content;
  return (
    <MainSection>
      <h1 className="text-center text-green-700">{post.basicInfo.title}</h1>
      <Image
        className="rounded-lg overflow-hidden shadow-[rgb(234,179,8,0.6)_5px_5px_10px_0px,rgb(21,128,61,0.6)_-5px_-5px_10px_0px]"
        src={post.basicInfo.mainImage.url}
        alt={
          post.basicInfo.mainImage.alternativeText ||
          post.basicInfo.mainImage.name
        }
        width={post.basicInfo.mainImage.width}
        height={post.basicInfo.mainImage.height}
      />
      {contents.map((item: ContentProps, index: number) => (
        <Content key={index} props={item} />
      ))}
      {post.sources && (
        <div className="flex flex-wrap gap-2 bg-gray-200 items-center w-fit px-2">
          <p>منبع</p>
          {post.sources.map((source) => (
            <a
              className="px-2 rounded-full border bg-white border-gray-800 w-fit hover:bg-yellow-500 text-gray-600 transition-colors"
              key={source.id}
              target="_blank"
              href={source.sourceUrl}
            >
              {source.websiteName}
            </a>
          ))}
        </div>
      )}
    </MainSection>
  );
}
