import qs from 'qs';
import { cache } from 'react';
import { dataFetch } from './dataFetch';
import { ContentProps, ImageProps, TagsProps } from './getPosts';
import { ShopCategoryProps } from './getProductCategories';

export interface ProductProps {
  id: number;
  documentId: string;
  detailes: ContentProps[];
  available: boolean;
  off: 'none' | 'offer' | 'special offer';
  variety: JSON;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  basicInfo: {
    id: number;
    title: string;
    mainImage: ImageProps;
    contentCode: number;
  };
  media: object[];
  category: ShopCategoryProps;
  seo: { id: number; seoTitle: string; seoDescription: string };
  tags: TagsProps[];
}

export const getProduct = cache(async function (slug: string, tag?: string[]) {
  const query = qs.stringify({
    filters: { basicInfo: { contentCode: { $eq: slug } } },
    populate: {
      seo: { populate: '*' },
      basicInfo: { populate: '*' },
      category: { populate: '*' },
      tag: { populate: '*' },
      media: { populate: '*' },
    },
  });
  const result = await dataFetch(`/products?${query}`, tag);
  return result;
});
