import { getCategories, getCategory } from '@/app/utils/data/getCategories';
import { getPostsByCategory } from '@/app/utils/data/getPosts';
import { MetadataRoute } from 'next';
import config from '../utils/config';

export async function generateSitemaps() {
  const categories = await getCategories();
  if (!categories || !Array.isArray(categories) || categories.length == 0)
    return;
  const mainCategories = categories.filter(
    (category) =>
      !category.parentCategories || category.parentCategories.length == 0
  );
  if (
    !mainCategories ||
    !Array.isArray(mainCategories) ||
    mainCategories.length == 0
  )
    return;
  const sitemapItems = mainCategories.map((category) => ({
    id: category.slug,
  }));
  return sitemapItems;
}

export default async function sitemap({
  id,
}: {
  id: string;
}): Promise<MetadataRoute.Sitemap> {
  const categoryList = await getCategory(id);
  if (!categoryList || !Array.isArray(categoryList) || categoryList.length == 0)
    return [];
  const getPosts = await getPostsByCategory({
    category: categoryList[0],
    isSiteMap: true,
  });
  if (
    getPosts &&
    getPosts.result &&
    Array.isArray(getPosts.result) &&
    getPosts.result.length > 0
  ) {
    const sitemapItems = getPosts.result.map((post) => ({
      url: `${config.siteUrl}/blog/posts/${post.basicInfo.contentCode}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));
    return [...sitemapItems];
  } else return [];
}
