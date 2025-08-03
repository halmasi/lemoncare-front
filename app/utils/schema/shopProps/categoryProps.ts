import { ProductProps } from './productProps';

export interface ShopSubCategoiesProps {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  products: ProductProps[];
  shopSubCategories: ShopCategoryProps[];
  shopParentCategory: ShopCategoryProps;
}

export interface ShopCategoryProps {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  products: ProductProps[];
  shopSubCategories: ShopSubCategoiesProps[];
  shopParentCategory: ShopSubCategoiesProps;
}

export interface ShopTagsProps {
  id: number;
  title: string;
  description: string;
  slug: string;
  products: ProductProps[];
}
