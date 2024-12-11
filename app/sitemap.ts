import { CategoriesProps, getCategories } from '@/utils/data/getCategories';

export default async function sitemap() {
  const dateNow = new Date(Date.now());
  const categories = await getCategories();
  const result = [
    {
      url: `${process.env.SITE_URL}`,
      lastModified: dateNow.toLocaleString('en-US'),
    },
    {
      url: `${process.env.SITE_URL}/blog/sitemap.xml`,
      lastModified: dateNow.toLocaleString('en-US'),
    },
    {
      url: `${process.env.SITE_URL}/shop/sitemap.xml`,
      lastModified: dateNow.toLocaleString('en-US'),
    },
  ];
  return result;
}
