import qs from 'qs';
import { cache } from 'react';
import { dataFetch } from './dataFetch';
import { TagsProps } from '../schema/blogProps';

export const getBlogTag = cache(async function ({
  slug,
  tag,
}: {
  slug: string;
  tag?: string[];
  page?: number;
  pageSize?: number;
}) {
  const query = qs.stringify({
    filters: {
      slug: { $eq: slug },
    },
    populate: {
      posts: { populate: '0' },
    },
  });
  const fetchData = await dataFetch({
    qs: `/tags?${query}`,
    tag,
    cache: 'force-cache',
  });
  const result: TagsProps = fetchData.data[0];
  return { result, meta: fetchData.meta };
});

export const getShopTag = cache(async function ({
  slug,
  tag,
}: {
  slug: string;
  tag?: string[];
  page?: number;
  pageSize?: number;
}) {
  const query = qs.stringify({
    filters: {
      slug: { $eq: slug },
    },
    populate: {
      products: { populate: '0' },
    },
  });
  const fetchData = await dataFetch({
    qs: `/shop-tags?${query}`,
    tag,
    cache: 'force-cache',
  });
  const result: TagsProps = fetchData.data[0];
  return { result, meta: fetchData.meta };
});
