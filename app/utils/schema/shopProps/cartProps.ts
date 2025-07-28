import { ImageProps } from '../mediaProps';

export interface CartProps {
  id?: number;
  count: number;
  product: cartProductsProps;
  variety: { id: number; sub: number | null };
  mainPrice?: number;
  beforePrice?: number;
}
export interface cartProductsProps {
  documentId: string;
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
  basicInfo: {
    id: number;
    title: string;
    mainImage: ImageProps;
    contentCode: number;
  };
}
