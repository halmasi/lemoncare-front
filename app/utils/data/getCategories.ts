import qs from 'qs';
import { dataFetch } from './dataFetch';
import { cache } from 'react';
import { CategoriesProps } from '@/app/utils/schema/blogProps';

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
  const fetchData = await dataFetch({
    qs: `/categories?${query}`,
    tag,
    cache: 'force-cache',
  });
  const data: CategoriesProps[] = fetchData.data;
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
  const res = await dataFetch({
    qs: `/categories?${query}`,
    tag,
    cache: 'force-cache',
  });
  return res.data;
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
  const res = await dataFetch({
    qs: `/categories?${query}`,
    tag,
    cache: 'force-cache',
  });
  return res.data;
});
