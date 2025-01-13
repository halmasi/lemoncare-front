import qs from 'qs';
import { dataFetch } from './dataFetch';
import { PostsProps } from './getPosts';
import { cache } from 'react';
import { ShopCategoryProps } from './getProductCategories';

export interface SubCategoryProps {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  posts: PostsProps[];
  childCategories: CategoriesProps[];
  parentCategories: CategoriesProps[];
}

export interface CategoriesProps {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string;
  url?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  posts: PostsProps[];
  childCategories: SubCategoryProps[];
  parentCategories: SubCategoryProps[];
}

export const getCategoriesUrl = cache(async function (
  category: CategoriesProps | string,
  tag?: string[]
): Promise<string> {
  let slug = category;
  if (typeof category != 'string') {
    slug = category.slug;
  }
  const query = qs.stringify({
    filters: { slug: { $eq: slug } },
    populate: {
      parentCategories: { populate: '*' },
    },
  });
  const data: CategoriesProps[] = await dataFetch(`/categories?${query}`, tag);
  const result = data[0];
  const res: string = result.slug;
  if (result.parentCategories && result.parentCategories.length > 0)
    return (
      (await getCategoriesUrl(result.parentCategories[0], tag)) + '/' + res
    );
  return res;
});

export const getCategory = cache(async function (
  slug: string,
  tag?: string[]
): Promise<CategoriesProps[]> {
  const query = qs.stringify({
    filters: { slug: { $eq: slug } },
    populate: {
      parentCategories: { populate: '*' },
      childCategories: { populate: '*' },
    },
  });

  return await dataFetch(`/categories?${query}`, tag);
});

export const getCategories = cache(async function (
  tag?: string[]
): Promise<CategoriesProps[]> {
  const query = qs.stringify({
    populate: {
      parentCategories: { populate: '*' },
      childCategories: { populate: '*' },
      posts: { populate: '*' },
    },
  });
  return await dataFetch(`/categories?${query}`, tag);
});
