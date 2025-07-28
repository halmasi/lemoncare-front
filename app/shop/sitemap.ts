import { MetadataRoute } from 'next';
import {
  getShopCategories,
  getShopCategory,
} from '../utils/data/getProductCategories';
import { getProductsByCategory } from '../utils/data/getProducts';

export const revalidate = 60 * 60;

export const dynamic = 'force-dynamic';

export async function generateSitemaps() {
  const categories = await getShopCategories();
  const mainCategories = categories.filter(
    (category) => !category.shopParentCategory
  );
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
  const getCategories = await getShopCategory(id);
  const products = await getProductsByCategory({
    category: getCategories[0],
    isSiteMap: true,
  });
  if (
    products &&
    products.res &&
    Array.isArray(products.res) &&
    products.res.length > 0
  ) {
    const sitemapItems = products.res.map((product) => ({
      url: `/shop/product/${product.basicInfo.contentCode}`,
      lastModified: product.updatedAt
        ? new Date(product.updatedAt)
        : new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));
    return [...sitemapItems];
  } else return [];
}
