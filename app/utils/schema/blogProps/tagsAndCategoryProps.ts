import { PostsProps } from './postProps';

export interface TagsProps {
  id: number;
  title: string;
  description: string;
  slug: string;
  posts: PostsProps[];
}

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
  url?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  posts: PostsProps[];
  childCategories: SubCategoryProps[];
  parentCategories: SubCategoryProps[];
}
