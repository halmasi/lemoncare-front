import { MetadataRoute } from 'next';
import {
  getShopCategories,
  getShopCategory,
} from '../utils/data/getProductCategories';
import { getProductsByCategory } from '../utils/data/getProducts';
import config from '../utils/config';

export async function generateSitemaps() {
  const categories = await getShopCategories();
  if (!categories || !Array.isArray(categories) || categories.length == 0)
    return;
  const mainCategories = categories.filter(
    (category) => !category.shopParentCategory
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
  const categoryList = await getShopCategory(id);
  if (
    !categoryList ||
    !Array.isArray(categoryList) ||
    categoryList.length === 0
  )
    return [];
  const products = await getProductsByCategory({
    category: categoryList[0],
    isSiteMap: true,
  });
  if (
    products &&
    products.res &&
    Array.isArray(products.res) &&
    products.res.length > 0
  ) {
    const sitemapItems = products.res.map((product) => ({
      url: `${config.siteUrl}/shop/product/${product.basicInfo.contentCode}`,
      lastModified: product.updatedAt
        ? new Date(product.updatedAt)
        : new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));
    return [...sitemapItems];
  } else return [];
}
