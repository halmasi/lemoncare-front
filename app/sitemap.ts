import type { MetadataRoute } from 'next';
import { getCategories } from './utils/data/getCategories';
import { getShopCategories } from './utils/data/getProductCategories';

export const dynamic = 'force-dynamic';

export const revalidate = 60 * 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = await getCategories();
  const shopCategory = await getShopCategories();
  const shopCategories = shopCategory.filter(
    (category) => !category.shopParentCategory
  );
  const mainCategories = categories.filter(
    (category) =>
      !category.parentCategories || category.parentCategories.length === 0
  );
  return [
    {
      url: '',
      priority: 1,
    },
    {
      url: '/shop',
      priority: 0.9,
      changeFrequency: 'hourly' as const,
    },
    {
      url: '/blog',
      priority: 0.9,
      changeFrequency: 'hourly' as const,
    },
    ...mainCategories.map((category) => ({
      url: `/blog/${category.slug}.xml`,
    })),
    ...shopCategories.map((category) => ({
      url: `/shop/${category.slug}.xml`,
    })),
    {
      url: '/pages/privacy-policy',
      priority: 0.5,
      changeFrequency: 'monthly' as const,
    },
    {
      url: '/pages/Terms-Conditions',
      priority: 0.5,
      changeFrequency: 'monthly' as const,
    },
    {
      url: '/pages/faq',
      priority: 0.5,
      changeFrequency: 'monthly' as const,
    },
    {
      url: '/pages/contact-us',
      priority: 0.5,
      changeFrequency: 'monthly' as const,
    },
  ].map((route: MetadataRoute.Sitemap[number]) => ({
    ...route,
    url: `https://lemiro.ir${route.url}`,
  }));
}
