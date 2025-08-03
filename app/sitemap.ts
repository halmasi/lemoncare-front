import type { MetadataRoute } from 'next';
import { getCategories } from './utils/data/getCategories';
import { getShopCategories } from './utils/data/getProductCategories';
import config from './utils/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const array: {
    url: string;
    priority?: number;
    changeFrequency?:
      | 'hourly'
      | 'daily'
      | 'weekly'
      | 'monthly'
      | 'yearly'
      | 'never';
  }[] = [
    {
      url: '/',
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
  ];
  const shopCategory = await getShopCategories();
  if (shopCategory) {
    const shopCategories = shopCategory.filter(
      (category) => !category.shopParentCategory
    );

    if (shopCategories) {
      shopCategories.forEach((category) =>
        array.push({
          url: `/shop/sitemap/${category.slug}.xml`,
        })
      );
    }
  }
  const categories = await getCategories();
  if (categories) {
    const mainCategories = categories.filter(
      (category) =>
        !category.parentCategories || category.parentCategories.length === 0
    );

    if (mainCategories) {
      mainCategories.forEach((category) =>
        array.push({
          url: `/blog/sitemap/${category.slug}.xml`,
        })
      );
    }
  }

  [
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
  ].forEach((item) => {
    array.push(item);
  });

  return array.map((route: MetadataRoute.Sitemap[number]) => ({
    ...route,
    url: `${config.siteUrl}${route.url}`,
  }));
}
