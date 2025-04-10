import qs from 'qs';
import { cache } from 'react';
import { dataFetch } from './dataFetch';
import { getCategorySubHierarchy } from './getProductCategories';
import {
  ProductProps,
  ShopCategoryProps,
  ShopSubCategoiesProps,
} from '@/app/utils/schema/shopProps';

export const getProduct = cache(async function (
  slug: string,
  options?: object[],
  tag?: string[]
): Promise<ProductProps[]> {
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
  const result = await dataFetch(`/products?${query}`, 'GET', tag);
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
  const result: ProductProps[] = await dataFetch(link, 'GET', tag);
  return result;
});

export const getProductsByCategory = cache(async function (
  category: ShopCategoryProps,
  tag?: string[]
): Promise<ProductProps[]> {
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
  });

  const result: ProductProps[] = await dataFetch(
    `/products?${query}&sort[0]=createdAt:desc`,
    'GET',
    tag
  );
  return result;
});

export const getProductsByTag = cache(async function (
  slug: string,
  tag?: string[]
): Promise<ProductProps[]> {
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
  });
  const result: ProductProps[] = await dataFetch(
    `/products?${query}&sort[0]=createdAt:desc`,
    'GET',
    tag
  );
  return result;
});
