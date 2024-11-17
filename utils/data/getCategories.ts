import qs from 'qs';
import { dataFetch } from './dataFetch';
import { PostsProps } from './getPosts';

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
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  posts: PostsProps[];
  childCategories: SubCategoryProps[];
  parentCategories: SubCategoryProps[];
}

export async function getCategoriesUrl(
  category: CategoriesProps
): Promise<string> {
  const query = qs.stringify({
    filters: { slug: { $eq: category.slug } },
    populate: {
      parentCategories: { populate: '*' },
    },
  });
  const data: CategoriesProps[] = await dataFetch(`/categories?${query}`);
  const result = data[0];
  const res: string = result.slug;
  if (result.parentCategories && result.parentCategories.length > 0)
    return (await getCategoriesUrl(result.parentCategories[0])) + '/' + res;
  return res;
}

export async function getCategoriesUrlBySlug(slug: string): Promise<string> {
  const query = qs.stringify({
    filters: { slug: { $eq: slug } },
    populate: {
      parentCategories: { populate: '*' },
    },
  });
  const data: CategoriesProps[] = await dataFetch(`/categories?${query}`);
  const result = data[0];
  const res: string = result.slug;
  if (result.parentCategories && result.parentCategories.length > 0)
    return (await getCategoriesUrl(result.parentCategories[0])) + '/' + res;
  return res;
}

export async function getCategory(slug: string): Promise<CategoriesProps[]> {
  const query = qs.stringify({
    filters: { slug: { $eq: slug } },
    populate: {
      parentCategories: { populate: '*' },
      childCategories: { populate: '*' },
    },
  });

  return await dataFetch(`/categories?${query}`);
}
