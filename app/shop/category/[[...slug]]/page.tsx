import ProductAndBlogSkeleton from '@/app/components/ProductAndBlogSkeleton';
import ProductsAndBlogPage from '@/app/components/ProductsAndBlogPage';
import { getShopCategory } from '@/app/utils/data/getProductCategories';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const slug = (await params).slug;

  const category = await getShopCategory(slug[slug.length - 1]);

  return {
    title: category[0].title + ' | lemiro - لمیرو',
    description: category[0].description,
    authors: [
      {
        name: 'lemiro - لمیرو',
        url: `https://lemiro.ir`,
      },
    ],
    applicationName: 'lemiro - لمیرو',
    category: category[0].title + ' | lemiro - لمیرو',
    openGraph: {
      title: category[0].title + ' | lemiro - لمیرو',
      description: category[0].description,
      siteName: 'lemiro - لمیرو',
      images: [
        {
          url: 'https://lemiro.ir/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FlemoncareLogoForHeader.29327b2f.png',
          width: 1200,
          height: 630,
          alt: 'lemiro - لمیرو',
        },
      ],
    },
  };
}

export default async function shopCategory({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string[] }>;
  searchParams?: Promise<{ [key: string]: string | undefined }>;
}) {
  const slug = (await params).slug;
  const searchParam = await searchParams;
  const page = parseInt(searchParam?.p || '1');

  if (!slug || !slug.length)
    return (
      <div>
        <h1 className="text-accent-pink">Recomended categories</h1>
      </div>
    );

  return (
    <div className="flex flex-col container py-5 px-2 md:px-10">
      {slug ? (
        <ProductsAndBlogPage
          type="product"
          slug={slug}
          resultBy="category"
          page={page}
        />
      ) : (
        <div className="grid grid-flow-row grid-cols-1 md:grid-cols-4 gap-3">
          <ProductAndBlogSkeleton count={10} />
        </div>
      )}
    </div>
  );
}
