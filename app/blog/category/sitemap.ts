import { getCategories, getCategory } from '@/app/utils/data/getCategories';
import { getPostsByCategory } from '@/app/utils/data/getPosts';
import { CategoriesProps } from '@/app/utils/schema/blogProps';

export async function generateSitemaps() {
  const categories = await getCategories();
  return Promise.all(
    categories
      .filter((category) => category.posts && category.posts.length)
      .map(async (category: CategoriesProps) => {
        return {
          id: category.slug,
        };
      })
  );
}

export default async function sitemap({ id }: { id: string }) {
  const category = await getCategory(id);
  const posts = await getPostsByCategory({
    category: category[0],
    isSiteMap: true,
  });
  if (!posts) return;
  return posts.result.map((post) => ({
    url: `${process.env.SITE_URL}/blog/posts/${post.basicInfo.contentCode}`,
    lastModified: post.updatedAt,
  }));
}
