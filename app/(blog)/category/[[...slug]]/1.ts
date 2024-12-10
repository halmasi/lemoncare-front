import {
  CategoriesProps,
  getCategories,
  getCategory,
} from '@/utils/data/getCategories';
import { getPostsByCategory } from '@/utils/data/getPosts';

export async function generateSitemap() {
  const categories = await getCategories();
  return Promise.all(
    categories
      .filter((category) => category.posts && category.posts.length)
      .map(
        async (category: CategoriesProps) => (
          console.log(category),
          {
            url: `/category/${category.slug}`,
            lastModified: category.updatedAt,
          }
        )
      )
  );
}
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
  const urlItems = id.split('/');
  const category = await getCategory(urlItems[urlItems.length - 1]);
  const posts = await getPostsByCategory(category[0]);
  return posts.map((post) => ({
    url: `/blog/posts/${post.basicInfo.contentCode}`,
    lastModified: post.updatedAt,
  }));
}
