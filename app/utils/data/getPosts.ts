import { dataFetch } from './dataFetch';
import qs from 'qs';
import { getCategory } from './getCategories';
import { cache } from 'react';
import {
  PostsProps,
  CategoriesProps,
  SubCategoryProps,
} from '@/app/utils/schema/blogProps';
import { AuthorProps } from '@/app/utils/schema/otherProps';

export const getPosts = cache(async function ({
  page = 1,
  pageSize = 10,
  tag,
}: {
  page?: number;
  pageSize?: number;
  tag?: string[];
}) {
  const query = qs.stringify({
    populate: {
      seo: { populate: '*' },
      author: { populate: 1 },
      basicInfo: { populate: '*' },
      category: { populate: '*' },
    },
    pagination: { page, pageSize },
  });
  let link = '/posts?' + query;

  const fetchData = await dataFetch({
    qs: link,
    method: 'GET',
    tag,
    cache: 'force-cache',
  });
  const result: PostsProps[] = fetchData.data;
  return { result, meta: fetchData.meta };
});

export const getPost = cache(async function (slug: string | number) {
  const filter =
    slug.toString().length > 6
      ? { documentId: { $eq: slug } }
      : { basicInfo: { contentCode: { $eq: slug } } };
  const query = qs.stringify({
    filters: filter,
    populate: {
      seo: { populate: '*' },
      author: { populate: 1 },
      basicInfo: { populate: '*' },
      category: { populate: '*' },
      tags: { populate: '*' },
      sources: { populate: '*' },
    },
  });
  const fetchData = await dataFetch({
    qs: `/posts?${query}`,
    cache: 'force-cache',
  });
  const result: PostsProps[] = fetchData.data;
  return result;
});

export const getCategoryHierarchy = cache(async function (
  category: SubCategoryProps[],
  direction: 'childCategories' | 'parentCategories',
  tag?: string[]
): Promise<CategoriesProps[]> {
  const allCategories: CategoriesProps[] = [];

  const result = await Promise.all(
    category.map(async (item) => {
      const res = await getCategory(item.slug, tag);
      return res[0];
    })
  );

  for (const e of result) {
    allCategories.push(e);
    if (e[direction] && e[direction].length > 0) {
      const fetchedCategories = await getCategoryHierarchy(
        e[direction],
        direction,
        tag
      );
      allCategories.push(...fetchedCategories);
    }
  }

  return allCategories;
});

export const getPostsByCategory = cache(async function ({
  category,
  tag,
  page = 1,
  pageSize = 10,
}: {
  category: CategoriesProps;
  tag?: string[];
  page?: number;
  pageSize?: number;
}) {
  if (!category) return;
  const subCategories: SubCategoryProps[] | [] =
    category.childCategories.length > 0
      ? await getCategoryHierarchy(
          category.childCategories,
          'childCategories',
          tag
        )
      : [];
  const slugs = [{ slug: { $eq: category.slug } }];
  subCategories.forEach((e) => {
    slugs.push({ slug: { $eq: e.slug } });
  });
  const query = qs.stringify({
    filters: {
      category: {
        $or: slugs,
      },
    },
    populate: {
      seo: { populate: '*' },
      author: { populate: 1 },
      basicInfo: { populate: '*' },
      category: { populate: '*' },
    },
    pagination: {
      page,
      pageSize,
    },
  });
  const fetchData = await dataFetch({
    qs: `/posts?${query}&sort[0]=createdAt:desc`,
    tag,
    cache: 'force-cache',
  });
  const result: PostsProps[] = fetchData.data;
  return { result, meta: fetchData.meta };
});

export const getPostsByTag = cache(async function ({
  slug,
  page = 1,
  pageSize = 10,
  tag,
}: {
  slug: string;
  tag?: string[];
  page?: number;
  pageSize?: number;
}) {
  const query = qs.stringify({
    filters: {
      tags: {
        slug: { $eq: slug },
      },
    },
    populate: {
      seo: { populate: '*' },
      author: { populate: 1 },
      basicInfo: { populate: '*' },
      category: { populate: '*' },
    },
    pagination: {
      page,
      pageSize,
    },
  });
  const fetchData = await dataFetch({
    qs: `/posts?${query}&sort[0]=createdAt:desc`,
    tag,
    cache: 'force-cache',
  });
  const result: PostsProps[] = fetchData.data;
  return { result, meta: fetchData.meta };
});

export const getPostsByAuthor = cache(async function ({
  slug,
  tag,
  page = 1,
  pageSize = 10,
}: {
  slug: string;
  tag?: string[];
  page?: number;
  pageSize?: number;
}) {
  const query = qs.stringify({
    filters: {
      author: {
        username: { $eq: slug },
      },
    },
    populate: {
      seo: { populate: '*' },
      author: { populate: 1 },
      basicInfo: { populate: '*' },
      category: { populate: '*' },
    },
    pagination: {
      page,
      pageSize,
    },
  });
  const fetchData = await dataFetch({
    qs: `/posts?${query}&sort[0]=createdAt:desc`,
    tag,
    cache: 'force-cache',
  });
  const result: PostsProps[] = fetchData.data;
  return { posts: result, meta: fetchData.meta };
});

export const getAuthorInformation = cache(async function (
  slug: string,
  tag?: string[]
) {
  const query = qs.stringify({
    filters: {
      username: { $eq: slug },
    },
  });
  const fetchData = await dataFetch({
    qs: `/authors?${query}`,
    tag,
    cache: 'force-cache',
  });
  const result: AuthorProps = fetchData.data[0];
  return result;
});
