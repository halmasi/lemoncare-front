import Suggestions from '@/app/components/Suggestions';
import { getPost } from '@/app/utils/data/getPosts';
import { getProduct } from '@/app/utils/data/getProducts';
import {
  getArticleSuggestions,
  getProductSuggestions,
} from '@/app/utils/data/getSuggestions';
import { GrArticle } from 'react-icons/gr';

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
      const singleProduct = await getProduct(product.documentId);
      return singleProduct[0];
    })
  );

  return (
    <div className="flex flex-col container max-w-screen-xl py-5 px-2 md:px-10">
      <div className="flex flex-col w-full ovrflow-hidden gap-10 justify-center">
        <Suggestions posts={await posts} title={suggestedArticles.title} id={0}>
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
  );
}
