import { ContentProps } from '../otherProps';
import { ImageProps, MediaProps } from '../mediaProps';
import { ShopCategoryProps } from './categoryProps';
import { TagsProps } from '@/app/utils/schema/blogProps';

export interface ProductProps {
  id: number;
  documentId: string;
  detailes: ContentProps[];
  available: boolean;
  off: 'none' | 'offer' | 'special offer';
  variety: {
    id: number;
    specification: string;
    priceBeforeDiscount: number;
    mainPrice: number;
    endOfDiscount: string;
    color: string;
    inventory: number;
    uniqueId: number;
    subVariety:
      | {
          id: number;
          specification: string;
          priceBefforDiscount: number;
          mainPrice: number;
          endOfDiscount: string;
          color: string;
          inventory: number;
          uniqueId: number;
        }[]
      | [];
  }[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  basicInfo: {
    slug: string;
    id: number;
    title: string;
    mainImage: ImageProps;
    contentCode: number;
  };
  product_view: {
    view: number;
    product: { documentId: string };
  };
  media: MediaProps[];
  category: ShopCategoryProps;
  seo: { id: number; seoTitle: string; seoDescription: string };
  tags: TagsProps[];
}
