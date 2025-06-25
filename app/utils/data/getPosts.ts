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

export const getPosts = cache(async function (count?: number, tag?: string[]) {
  const query = qs.stringify({
    populate: {
      seo: { populate: '*' },
      author: { populate: 1 },
      basicInfo: { populate: '*' },
      category: { populate: '*' },
    },
  });
  let link = '/posts?' + query;
  if (count) {
    link += `&pagination[limit]=${count}&sort[0]=createdAt:desc`;
  }
  const result: PostsProps[] = await dataFetch({
    qs: link,
    method: 'GET',
    tag,
    cache: 'force-cache',
  });

  return result;
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
  const result: PostsProps[] = await dataFetch({
    qs: `/posts?${query}`,
    cache: 'force-cache',
  });
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

export const getPostsByCategory = cache(async function (
  category: CategoriesProps,
  tag?: string[]
) {
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
  });
  const result: PostsProps[] = await dataFetch({
    qs: `/posts?${query}&sort[0]=createdAt:desc`,
    tag,
    cache: 'force-cache',
  });
  return result;
});

export const getPostsByTag = cache(async function (
  slug: string,
  tag?: string[]
) {
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
  });
  const result: PostsProps[] = await dataFetch({
    qs: `/posts?${query}&sort[0]=createdAt:desc`,
    tag,
    cache: 'force-cache',
  });
  return result;
});

export const getPostsByAuthor = cache(async function (
  slug: string,
  tag?: string[]
) {
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
  });
  const result: PostsProps[] = await dataFetch({
    qs: `/posts?${query}&sort[0]=createdAt:desc`,
    tag,
    cache: 'force-cache',
  });
  return result;
});

export const getAuthorInformation = cache(async function (
  id: string,
  tag?: string[]
) {
  const result: AuthorProps = await dataFetch({
    qs: `/authors/${id}`,
    tag,
    cache: 'force-cache',
  });
  return result;
});
