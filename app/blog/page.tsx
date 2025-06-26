import { getPosts } from '@/app/utils/data/getPosts';
import { getSlides } from '../utils/data/getSuggestions';
import Slide from '../components/Slide';
import ProductsAndBlogPage from '../components/ProductsAndBlogPage';

export default async function BlogHomePage() {
  const slide = await getSlides('blog');

  return (
    <article className="w-full flex flex-col items-center">
      <div className="py-5 px-2">
        <Slide media={slide.medias} />
      </div>

      <main className="flex flex-col container max-w-screen-xl py-5 px-10 space-y-2">
        <ProductsAndBlogPage resultBy="full" slug={['']} type="post" page={1} />
      </main>
    </article>
  );
}
