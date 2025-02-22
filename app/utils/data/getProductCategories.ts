import { cache } from 'react';
import { dataFetch } from './dataFetch';
import qs from 'qs';
import {
  ShopCategoryProps,
  ShopSubCategoiesProps,
} from '../schema/shopProps/categoryProps';

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

export const getCategorySubHierarchy = cache(async function (
  category: ShopSubCategoiesProps[],
  tag?: string[]
): Promise<ShopCategoryProps[]> {
  const allCategories: ShopCategoryProps[] = [];
  const result = await Promise.all(
    category.map(async (item) => {
      const res = await getShopCategory(item.slug, tag);
      return res[0];
    })
  );

  for (const e of result) {
    allCategories.push(e);
    if (e.shopSubCategories && e.shopSubCategories.length > 0) {
      const fetchedCategories = await getCategorySubHierarchy(
        e.shopSubCategories,
        tag
      );
      allCategories.push(...fetchedCategories);
    }
  }

  return allCategories;
});

export const getCategoryparentHierarchy = cache(async function (
  category: ShopSubCategoiesProps,
  tag?: string[]
): Promise<ShopCategoryProps[]> {
  const allCategories: ShopCategoryProps[] = [];
  const res = await getShopCategory(category.slug, tag);
  const result = res[0];
  allCategories.push(result);

  if (result.shopParentCategory) {
    getCategoryparentHierarchy(result.shopParentCategory, tag).then(
      (fetchedCategories) => {
        allCategories.push(...fetchedCategories);
      }
    );
  }

  return allCategories;
});
