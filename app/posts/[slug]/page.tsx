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
      <div className="rounded-2xl overflow-hidden shadow-[rgb(234,179,8,0.6)_5px_5px_10px_0px,rgb(21,128,61,0.6)_-5px_-5px_10px_0px]">
        <Image
          src={post.basicInfo.mainImage.url}
          alt={
            post.basicInfo.mainImage.alternativeText ||
            post.basicInfo.mainImage.name
          }
          width={post.basicInfo.mainImage.width}
          height={post.basicInfo.mainImage.height}
        />
      </div>
      {contents.map((item: ContentProps, index: number) => (
        <Content key={index} props={item} />
      ))}
    </MainSection>
  );
}
