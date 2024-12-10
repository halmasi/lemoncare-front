import { getPosts } from '@/utils/data/getPosts';

export default async function sitemap() {
  const posts = await getPosts();
  const postsMap = posts.map((post) => {
    return {
      url: `https://lemoncare.ir/blog/${post.basicInfo.contentCode}`,
      lastModified: post.createdAt,
      priority: 0.8,
    };
  });
  return [
    {
      url: 'https://lemoncare.ir',
      lastModified: Date.now(),
      priority: 1,
    },
    ...postsMap,
  ];
}
