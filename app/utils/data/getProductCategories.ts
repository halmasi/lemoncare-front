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
    populate: {
      shopParentCategory: { populate: '*' },
      shopSubCategories: { populate: '*' },
    },
  });
  const result = await dataFetch(`/shop-categories?${query}`, tag);
  return result;
});

export const getShopCategoriesUrl = cache(async function (
  category: ShopCategoryProps | string,
  tag?: string[]
): Promise<string> {
  let slug = category;
  if (typeof category != 'string') {
    slug = category.slug;
  }
  const query = qs.stringify({
    filters: { slug: { $eq: slug } },
    populate: {
      shopParentCategory: { populate: '*' },
    },
  });
  const data: ShopCategoryProps[] = await dataFetch(
    `/shop-categories?${query}`,
    tag
  );
  const result = data[0];
  const res: string = result.slug;
  if (result.shopParentCategory)
    return (
      (await getShopCategoriesUrl(result.shopParentCategory, tag)) + '/' + res
    );
  return res;
});
