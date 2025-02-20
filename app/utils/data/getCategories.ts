import qs from 'qs';
import { dataFetch } from './dataFetch';
import { cache } from 'react';
import { CategoriesProps } from '../schema/blogProps/tagsAndCategoryProps';

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
