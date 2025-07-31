import { MetadataRoute } from 'next';
import config from './utils/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/cart', '/dashboard'],
      },
    ],
    sitemap: `${config.siteUrl}/sitemap.xml`,
  };
}
