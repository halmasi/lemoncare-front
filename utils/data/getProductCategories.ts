import { cache } from 'react';
import { ProductProps } from './getProducts';
import { dataFetch } from './dataFetch';
import qs from 'qs';

export interface ShopSubCategoiesProps {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  products: ProductProps[];
  shopSubCategories: ShopCategoryProps[];
  shopParentCategory: ShopCategoryProps;
}

export interface ShopCategoryProps {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  products: ProductProps[];
  shopSubCategories: ShopSubCategoiesProps[];
  shopParentCategory: ShopSubCategoiesProps;
}

export const getShopCategory = cache(async function (
  slug: string,
  tag?: string[]
): Promise<ShopCategoryProps[]> {
  const query = qs.stringify({
    filters: { slug: { $eq: slug } },
    // populate: '*',
    populate: {
      shopParentCategory: { populate: '*' },
      shopSubCategories: { populate: '*' },
    },
  });
  const result = await dataFetch(`/shop-categories?${query}`, tag);
  return result;
});
