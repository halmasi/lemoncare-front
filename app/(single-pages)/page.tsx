import Slide from '@/app/components/Slide';
import Suggestions from '@/app/components/Suggestions';
import { getPost } from '@/app/utils/data/getPosts';
import { getProduct } from '@/app/utils/data/getProducts';
import {
  getArticleSuggestions,
  getProductSuggestions,
} from '@/app/utils/data/getSuggestions';
import { GrArticle } from 'react-icons/gr';
import Head from 'next/head';
import { Metadata } from 'next';
import config from '../utils/config';
import Logo from '@/public/lemiroLogoForHeader.png';

export const metadata: Metadata = {
  title: 'lemiro - لمیرو',
  description: 'وبسایت تخصصی مراقبت از پوست و مو',
  applicationName: 'lemiro - لمیرو',
  openGraph: {
    title: 'lemiro - لمیرو',
    description: 'وبسایت تخصصی مراقبت از پوست و مو',
    siteName: 'lemiro - لمیرو',
    locale: 'fa-IR',
    type: 'website',
    url: config.siteUrl,
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

export default async function page() {
  const suggestedArticles = await getArticleSuggestions('homepage-slide');
  const suggestedProducts = await getProductSuggestions('homepage-slide');

  const posts = Promise.all(
    suggestedArticles.posts.map(async (post) => {
      const singlePost = await getPost(post.documentId);
      return singlePost[0];
    })
  );

  const products = Promise.all(
    suggestedProducts.products.map(async (product) => {
      const singleProduct = await getProduct({ slug: product.documentId });
      return singleProduct.res[0];
    })
  );

  return (
    <>
      <Head>
        <meta name="enamad" content="" />
      </Head>
      <div className="flex flex-col container max-w-screen-xl py-5 px-2 md:px-10">
        <Slide slug="homepage" />
        <div className="flex flex-col w-full ovrflow-hidden gap-10 justify-center">
          <Suggestions
            posts={await posts}
            title={suggestedArticles.title}
            id={0}
          >
            <GrArticle />
          </Suggestions>
          <Suggestions
            products={await products}
            title={suggestedProducts.title}
            id={1}
          >
            <GrArticle />
          </Suggestions>
        </div>
      </div>
    </>
  );
}
