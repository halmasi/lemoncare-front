import qs from 'qs';

import { dataFetch } from './dataFetch';
import { PostsProps } from './getPosts';
import { ProductProps } from './getProducts';

interface ArticleSuggestionProps {
  title: string;
  slug: string;
  posts: PostsProps[];
}

interface ProductSuggestionProps {
  title: string;
  slug: string;
  products: ProductProps[];
}

export const getArticleSuggestions = async (
  slug: string
): Promise<ArticleSuggestionProps> => {
  const query = qs.stringify({
    filter: {
      slug,
    },
    populate: {
      posts: {
        seo: { populate: '*' },
        author: { populate: 1 },
        basicInfo: { populate: '*' },
        category: { populate: '*' },
        tags: { populate: '*' },
        sources: { populate: '*' },
      },
    },
  });
  const data = await dataFetch(`/suggested-articles?${query}`, [
    `suggested-article-${slug}`,
  ]);
  return data[0];
};
