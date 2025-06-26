import qs from 'qs';
import { cache } from 'react';
import { dataFetch } from './dataFetch';
import { getCategorySubHierarchy } from './getProductCategories';
import {
  ProductProps,
  ShopCategoryProps,
  ShopSubCategoiesProps,
} from '@/app/utils/schema/shopProps';
import { MetaProps } from '../schema/metaProps';

export const getProduct = cache(async function (
  slug: string,
  options?: object[],
  tag?: string[]
): Promise<{ res: ProductProps[]; allData: object }> {
  const filter =
    slug.length > 6
      ? { documentId: { $eq: slug } }
      : { basicInfo: { contentCode: { $eq: slug } } };

  const populate = options
    ? Object.assign(
        { basicInfo: { populate: '*' }, variety: { populate: '*' } },
        ...options
      )
    : {
        seo: { populate: '*' },
        basicInfo: { populate: '*' },
        category: { populate: '*' },
        tags: { populate: '*' },
        media: { populate: 1 },
        variety: { populate: '*' },
      };
  const query = qs.stringify({
    filters: filter,
    populate,
  });
  const fetchData = await dataFetch({
    qs: `/products?${query}`,
    tag,
    cache: 'force-cache',
  });
  return { res: fetchData.data, allData: fetchData };
});

export const getProducts = cache(async function ({
  tag,
  page = 1,
  pageSize = 10,
}: {
  tag?: string[];
  page?: number;
  pageSize?: number;
}) {
  const query = qs.stringify({
    populate: {
      seo: { populate: '*' },
      basicInfo: { populate: '*' },
      category: { populate: '*' },
      variety: { populate: '*' },
    },
    pagination: {
      page,
      pageSize,
    },
  });
  let link = '/products?' + query;
  const result = await dataFetch({
    qs: link,
    tag,
    cache: 'force-cache',
  });
  const res: ProductProps[] = result.data;
  return { res, meta: result.meta, allData: result };
});

export const getProductsByCategory = cache(async function ({
  category,
  tag,
  pageSize = 10,
  page = 1,
}: {
  category: ShopCategoryProps;
  tag?: string[];
  pageSize?: number;
  page?: number;
}): Promise<{ res: ProductProps[]; meta: MetaProps }> {
  const subCategories: ShopSubCategoiesProps[] | [] =
    category.shopSubCategories.length > 0
      ? await getCategorySubHierarchy(category.shopSubCategories, tag)
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
      basicInfo: { populate: '*' },
      category: { populate: '*' },
      variety: { populate: '*' },
    },
    pagination: {
      page,
      pageSize,
    },
  });

  const result = await dataFetch({
    qs: `/products?${query}&sort[0]=createdAt:desc`,
    tag,
    cache: 'force-cache',
  });
  const productsList: ProductProps[] = result.data;
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return { res: productsList, meta: result.meta };
});

export const getProductsByTag = cache(async function ({
  slug,
  tag,
  page = 1,
  pageSize = 10,
}: {
  slug: string;
  tag?: string[];
  page?: number;
  pageSize?: number;
}): Promise<{ res: ProductProps[]; meta: MetaProps }> {
  const query = qs.stringify({
    filters: {
      tags: {
        slug: { $eq: slug },
      },
    },
    populate: {
      seo: { populate: '*' },
      basicInfo: { populate: '*' },
      category: { populate: '*' },
      variety: { populate: '*' },
    },
    pagination: {
      page,
      pageSize,
    },
  });
  const result = await dataFetch({
    qs: `/products?${query}&sort[0]=createdAt:desc`,
    tag,
    cache: 'force-cache',
  });
  return { res: result.data, meta: result.meta };
});
