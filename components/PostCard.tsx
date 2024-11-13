import { PostsProps } from '@/utils/getPosts';

export default function PostCard({
  documentId,
  category,
  basicInfo,
  seo,
}: {
  documentId: string;
  category: string;
  basicInfo: { title: string };
  seo: { seoDescription: string };
}) {
  return <p>{basicInfo.title}</p>;
}
