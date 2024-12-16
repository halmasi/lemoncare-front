import { CategoriesProps, getCategories } from '@/utils/data/getCategories';

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
