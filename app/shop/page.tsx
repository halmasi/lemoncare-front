import ProductsAndBlogPage from '@/app/components/ProductsAndBlogPage';
import { Metadata } from 'next';
import config from '../utils/config';
import Logo from '@/public/lemiroLogoForHeader.png';

export const metadata: Metadata = {
  title: 'lemiro - محصولات لمیرو',
  description: 'وبسایت تخصصی مراقبت از پوست و مو',
  openGraph: {
    title: 'lemiro - محصولات لمیرو',
    description: 'وبسایت تخصصی مراقبت از پوست و مو',
    siteName: 'lemiro - لمیرو',
    images: [
      {
        url: `${config.siteUrl}${Logo.src}`,
        width: 1200,
        height: 630,
        alt: 'lemiro - محصولات لمیرو',
      },
    ],
  },
};

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
    </div>
  );
}
