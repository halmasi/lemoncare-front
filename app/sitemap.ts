import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const dateNow = new Date(Date.now());
  const result = [
    {
      url: `${process.env.SITE_URL}`,
      lastModified: dateNow.toISOString(),
    },
    {
      url: `${process.env.SITE_URL}/blog/sitemap.xml`,
      lastModified: dateNow.toISOString(),
    },
    {
      url: `${process.env.SITE_URL}/shop/sitemap.xml`,
      lastModified: dateNow.toISOString(),
    },
  ];
  return result;
}
