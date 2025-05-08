import { getShopCategory } from '@/app/utils/data/getProductCategories';
import { getProductsByCategory } from '@/app/utils/data/getProducts';
import { notFound } from 'next/navigation';
import ProductCart from '@/app/components/ProductCart';

export default async function shopCategory({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const slug = (await params).slug;
  if (!slug || !slug.length)
    return (
      <div>
        <h1 className="text-accent-pink">Recomended categories</h1>
      </div>
    );
  const category = await getShopCategory(slug[slug.length - 1]);
  if (!category.length) return notFound();
  const products = await getProductsByCategory(category[0]);
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
