import ProductAndBlogSkeleton from '@/app/components/ProductAndBlogSkeleton';
import ProductsAndBlogPage from '@/app/components/ProductsAndBlogPage';
import config from '@/app/utils/config';
import { getShopTag } from '@/app/utils/data/getTags';
import { Metadata } from 'next';
import Logo from '@/public/lemiroLogoForHeader.png';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;

  const getTag = await getShopTag({
    slug,
  });

  return {
    title: getTag.result.title + ' | lemiro - لمیرو',
    description: getTag.result.description,
    authors: [
      {
        name: 'lemiro - لمیرو',
        url: config.siteUrl,
      },
    ],
    applicationName: 'lemiro - لمیرو',
    category: getTag.result.title + ' | lemiro - لمیرو',
    openGraph: {
      title: getTag.result.title + ' | lemiro - لمیرو',
      description: getTag.result.description,
      siteName: 'lemiro - لمیرو',
      images: [
        {
          url: `${config.siteUrl}${Logo.src}`,
          width: 1200,
          height: 630,
          alt: 'lemiro - لمیرو',
        },
      ],
    },
  };
}

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
