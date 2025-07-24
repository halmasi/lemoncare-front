import { getCategories } from '@/app/utils/data/getCategories';
import { CategoriesProps } from '@/app/utils/schema/blogProps';

export default async function generateSitemap() {
  const categories = await getCategories();

  return Promise.all(
    categories
      .filter((category) => category.posts && category.posts.length)
      .map(async (category: CategoriesProps) => {
        return {
          url: `${process.env.SITE_URL}/blog/category/sitemap/${category.slug}.xml`,
          lastModified: category.updatedAt,
        };
      })
  );
}
