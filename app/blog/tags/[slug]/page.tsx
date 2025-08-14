import ProductsAndBlogPage from '@/app/components/ProductsAndBlogPage';
import { Metadata } from 'next';
import { getBlogTag } from '@/app/utils/data/getTags';
import config from '@/app/utils/config';
import Logo from '@/public/lemiroLogoForHeader.png';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | undefined }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const tag = await getBlogTag({ slug });

  return {
    title: tag.result.title + ' | lemiro - لمیرو',
    description: tag.result.description,
    authors: [
      {
        name: 'lemiro - لمیرو',
        url: config.siteUrl,
      },
    ],
    applicationName: 'lemiro - لمیرو',
    openGraph: {
      title: tag.result.title + ' | lemiro - لمیرو',
      description: tag.result.description,
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

export default async function page({ params, searchParams }: Props) {
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
