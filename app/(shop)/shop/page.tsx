import { getProducts } from '../../utils/data/getProducts';
import ProductCart from '@/app/components/ProductCart';

export default async function shopPage() {
  const products = await getProducts(3);
  return (
    <div className="flex flex-col container py-5 px-2 md:px-10">
      <div className="grid grid-flow-row grid-cols-1 md:grid-cols-4 gap-3">
        {products.map((item) => (
          <ProductCart product={item} key={item.id} />
        ))}
      </div>
    </div>
  );
}
