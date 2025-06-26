import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import { getCategory } from '@/app/utils/data/getCategories';
import ProductsAndBlogPage from '@/app/components/ProductsAndBlogPage';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const fetchCategory = await getCategory(slug[slug.length - 1]);
  if (fetchCategory && fetchCategory.length < 1) return notFound();
  const category = fetchCategory[0];

  return {
    title: category.title + ' | Lemoncare - لمن کر',
    description: category.description,
    authors: [
      {
        name: 'Lemoncare - لمن کر',
        url: `https://lemoncare.ir/`,
      },
    ],
    applicationName: 'lemoncare - لمن کر',
    category: category.title + ' | Lemoncare - لمن کر',
    openGraph: {
      title: category.title + ' | Lemoncare - لمن کر',
      description: category.description,
      siteName: 'لمن کر - lemoncare',
    },
  };
}

export default async function Category({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string[] }>;
  searchParams?: Promise<{ [key: string]: string | undefined }>;
}) {
  const slug = (await params).slug;
  const searchParam = await searchParams;
  const page = parseInt(searchParam?.p || '1');

  const fetchCategory = await getCategory(slug[slug.length - 1]);

  return (
    <main className="flex flex-col container max-w-screen-xl py-5 px-10 space-y-2">
      <h4 className="text-accent-pink">دسته بندی : {fetchCategory[0].title}</h4>
      <ProductsAndBlogPage
        resultBy="category"
        slug={[slug[slug.length - 1]]}
        type="post"
        page={page}
      />
    </main>
  );
}
