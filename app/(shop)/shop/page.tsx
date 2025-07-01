import ProductsAndBlogPage from '@/app/components/ProductsAndBlogPage';

export default async function shopPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | undefined }>;
}) {
  const searchParam = await searchParams;
  const page = parseInt(searchParam?.p || '1');

  return (
    <div className="flex flex-col container py-5 px-2 md:px-10">
      <ProductsAndBlogPage
        page={page}
        resultBy="full"
        slug={['']}
        type="product"
      />

      {/* <div className="grid grid-flow-row grid-cols-1 md:grid-cols-4 gap-3">
        {products.res.map((item) => (
          <ProductCart product={item} key={item.id} />
        ))}
      </div> */}
    </div>
  );
}
