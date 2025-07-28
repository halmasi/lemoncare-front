import Slide from '../components/Slide';
import ProductsAndBlogPage from '../components/ProductsAndBlogPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'lemiro - مقالات لمیرو',
  description: 'وبسایت تخصصی مراقبت از پوست و مو',
  openGraph: {
    title: 'lemiro - مقالات لمیرو',
    description: 'وبسایت تخصصی مراقبت از پوست و مو',
    siteName: 'lemiro - لمیرو',
    images: [
      {
        url: 'https://lemiro.ir/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FlemoncareLogoForHeader.29327b2f.png',
        width: 1200,
        height: 630,
        alt: 'lemiro - مقالات لمیرو',
      },
    ],
  },
};

export default async function BlogHomePage() {
  return (
    <article className="w-full flex flex-col items-center">
      <Slide slug="blog" className="py-5 px-2" />

      <main className="flex flex-col container max-w-screen-xl py-5 px-10 space-y-2">
        <ProductsAndBlogPage resultBy="full" slug={['']} type="post" page={1} />
      </main>
    </article>
  );
}
