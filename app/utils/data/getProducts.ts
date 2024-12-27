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
  variety: {
    id: number;
    specification: string;
    priceBefforDiscount: number;
    mainPrice: number;
    endOfDiscount: string;
    color: string;
    subVariety:
      | {
          id: number;
          specification: string;
          priceBefforDiscount: number;
          mainPrice: number;
          endOfDiscount: string;
          color: string;
        }[]
      | [];
  }[];
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
      variety: { populate: '*' },
    },
  });
  const result = await dataFetch(`/products?${query}`, tag);
  return result;
});

export const getProducts = cache(async function (
  count: number,
  tag?: string[]
) {
  const query = qs.stringify({
    populate: {
      seo: { populate: '*' },
      basicInfo: { populate: '*' },
      category: { populate: '*' },
      variety: { populate: '*' },
    },
  });
  let link = '/products?' + query;
  if (count) {
    link += `&pagination[limit]=${count}&sort[0]=createdAt:desc`;
  }
  const result: ProductProps[] = await dataFetch(link, tag);
  return result;
});
