import { ProductProps } from './productProps';

export interface CartProps {
  id?: number;
  count: number;
  product: ProductProps;
  variety: { id: number; sub: number | null };
  mainPrice?: number;
  beforePrice?: number;
}
