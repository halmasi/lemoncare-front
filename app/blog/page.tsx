import Slide from '../components/Slide';
import ProductsAndBlogPage from '../components/ProductsAndBlogPage';

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
