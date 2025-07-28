import { getCategories, getCategory } from '@/app/utils/data/getCategories';
import { getPostsByCategory } from '@/app/utils/data/getPosts';
import { MetadataRoute } from 'next';

export const revalidate = 60 * 60 * 24;

export const dynamic = 'force-dynamic';

export async function generateSitemaps() {
  const categories = await getCategories();
  const mainCategories = categories.filter(
    (category) =>
      !category.parentCategories || category.parentCategories.length === 0
  );
  const sitemapItems = mainCategories.map((category) => ({
    id: category.slug,
  }));
  return [...sitemapItems];
}

export default async function sitemap({
  id,
}: {
  id: string;
}): Promise<MetadataRoute.Sitemap> {
  const getCategories = await getCategory(id);
  const getPosts = await getPostsByCategory({
    category: getCategories[0],
    isSiteMap: true,
  });
  if (
    getPosts &&
    getPosts.result &&
    Array.isArray(getPosts.result) &&
    getPosts.result.length > 0
  ) {
    const sitemapItems = getPosts.result.map((post) => ({
      url: `/blog/posts/${post.basicInfo.contentCode}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));
    return [...sitemapItems];
  } else return [];
}
