import { getProductsByTag } from '@/app/utils/data/getProducts';
import { notFound } from 'next/navigation';
import ProductCart from '@/app/components/ProductCart';

export default async function tags({ params }: { params: { slug: string } }) {
  const products = await getProductsByTag(params.slug);
  if (!products.length) return notFound();
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
