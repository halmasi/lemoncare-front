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
import {
  DetaileKeyProps,
  DetaileValueProps,
} from '../schema/shopProps/productProps';

export const getProduct = cache(async function ({
  slug,
  options,
  tag = [],
}: {
  slug: string;
  options?: object[];
  tag?: string[];
}): Promise<{ res: ProductProps[]; allData: object }> {
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
        tags: { populate: '*' },
        media: { populate: 1 },
        variety: { populate: '*' },
        category: { populate: '*' },
        brand: { populate: '1' },
        detailesTable: { populate: '*' },
      };
  const query = qs.stringify({
    filters: filter,
    populate,
  });
  tag.push(slug);
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
  isFetchAll = false,
  sort = { createdAt: 'desc' },
  populate = {
    basicInfo: { populate: '*' },
    variety: { populate: '*' },
    seo: { populate: '*' },
    category: { populate: '*' },
    tags: { populate: '*' },
    brand: { populate: '1' },
  },
}: {
  tag?: string[];
  page?: number;
  pageSize?: number;
  isFetchAll?: boolean;
  populate?: object;
  sort?: object;
}) {
  const query = qs.stringify({
    populate,
    sort,
    pagination: isFetchAll
      ? {}
      : {
          page,
          pageSize,
        },
  });
  const link = '/products?' + query;
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
  productDocumentId,
  isSiteMap = false,
  brand,
  pageSize = 10,
  page = 1,
  sort = { createdAt: 'desc' },
  populate = {
    basicInfo: { populate: '*' },
    variety: { populate: '*' },
    seo: { populate: '*' },
    category: { populate: '*' },
    brand: { populate: '1' },
  },
}: {
  category: ShopCategoryProps;
  tag?: string[];
  productDocumentId?: string;
  brand?: string;
  pageSize?: number;
  page?: number;
  isSiteMap?: boolean;
  populate?: object;
  sort?: object;
}): Promise<{ res: ProductProps[]; meta: MetaProps }> {
  const subCategories: ShopSubCategoiesProps[] | [] =
    category.shopSubCategories.length > 0
      ? await getCategorySubHierarchy(category.shopSubCategories, tag)
      : [];

  const slugs = [{ slug: { $eq: category.slug } }];
  subCategories.forEach((e) => {
    slugs.push({ slug: { $eq: e.slug } });
  });
  const filters = {
    category: {
      $or: slugs,
    },
  };
  if (productDocumentId)
    Object.assign(filters, {
      documentId: { $eq: productDocumentId },
    });
  if (brand)
    Object.assign(filters, {
      brand: { slug: { $eq: brand } },
    });

  const query = qs.stringify({
    filters,
    populate,
    sort,
  });

  if (!isSiteMap) {
    Object.assign(query, {
      pagination: {
        page,
        pageSize,
      },
    });
  }

  const result = await dataFetch({
    qs: `/products?${query}`,
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
  productDocumentId,
  page = 1,
  pageSize = 10,
  isFetchAll = false,
  sort = { createdAt: 'desc' },

  populate = {
    seo: { populate: '*' },
    basicInfo: { populate: '*' },
    category: { populate: '*' },
    variety: { populate: '*' },
    tags: { populate: '*' },
    brand: { populate: '1' },
  },
}: {
  slug: string;
  productDocumentId?: string;
  tag?: string[];
  page?: number;
  pageSize?: number;
  isFetchAll?: boolean;
  populate?: object;
  sort?: object;
}): Promise<{ res: ProductProps[]; meta: MetaProps }> {
  const filters = {
    tags: {
      slug: { $eq: slug },
    },
  };
  if (productDocumentId)
    Object.assign(filters, {
      documentId: { $eq: productDocumentId },
    });
  const query = qs.stringify({
    filters,
    populate,
    sort,
    pagination: isFetchAll
      ? {}
      : {
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

export const getProductsByBrand = cache(async function ({
  slug,
  tag,
  productDocumentId,
  page = 1,
  pageSize = 10,
  isFetchAll = false,
  sort = { createdAt: 'desc' },

  populate = {
    seo: { populate: '*' },
    basicInfo: { populate: '*' },
    category: { populate: '*' },
    variety: { populate: '*' },
    tags: { populate: '*' },
    brand: { populate: '1' },
  },
}: {
  slug: string;
  productDocumentId?: string;
  tag?: string[];
  page?: number;
  pageSize?: number;
  isFetchAll?: boolean;
  populate?: object;
  sort?: object;
}): Promise<{ res: ProductProps[]; meta: MetaProps }> {
  const filters = {
    brand: {
      slug: { $eq: slug },
    },
  };
  if (productDocumentId)
    Object.assign(filters, {
      documentId: { $eq: productDocumentId },
    });
  const query = qs.stringify({
    filters,
    populate,
    sort,
    pagination: isFetchAll
      ? {}
      : {
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

export const getDetailesKey = cache(
  async ({ id, tag = [] }: { id: string; tag?: string[] }) => {
    const data = await dataFetch({
      qs: `/detaile-keys/${id}?pLevel`,
      cache: 'force-cache',
      tag: [...tag, id],
    });
    const res: DetaileKeyProps = data.data;
    return res;
  }
);
export const getDetailesValue = cache(
  async ({ id, tag = [] }: { id: string; tag?: string[] }) => {
    const data = await dataFetch({
      qs: `/detaile-values/${id}?pLevel`,
      cache: 'force-cache',
      tag: [...tag, id],
    });
    const res: DetaileValueProps = data.data;
    return res;
  }
);
