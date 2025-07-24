import ProductAndBlogSkeleton from '@/app/components/ProductAndBlogSkeleton';
import ProductsAndBlogPage from '@/app/components/ProductsAndBlogPage';

export default async function tags({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | undefined }>;
}) {
  const slug = (await params).slug;
  const searchParam = await searchParams;
  const page = parseInt(searchParam?.p || '1');

  return (
    <div className="flex flex-col container py-5 px-2 md:px-10">
      {slug ? (
        <ProductsAndBlogPage
          type="product"
          slug={[slug]}
          page={page}
          resultBy="tag"
        />
      ) : (
        <div className="grid grid-flow-row grid-cols-1 md:grid-cols-4 gap-3">
          <ProductAndBlogSkeleton count={10} />
        </div>
      )}
    </div>
  );
}
