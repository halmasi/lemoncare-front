import ProductsAndBlogPage from '@/app/components/ProductsAndBlogPage';

export default async function page({
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
    <main className="flex flex-col container max-w-screen-xl py-5 px-10 space-y-2">
      <ProductsAndBlogPage
        resultBy="tag"
        slug={[slug]}
        type="post"
        page={page}
      />
    </main>
  );
}
