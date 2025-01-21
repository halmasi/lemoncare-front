import qs from 'qs';

import { dataFetch } from './dataFetch';
import { PostsProps } from './getPosts';
import { MediaProps, ProductProps } from './getProducts';
import { cache } from 'react';

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

interface SlideProps {
  slug: string;
  location: 'homepage' | 'shop' | 'blog' | 'category' | 'brand';
  media: {
    link: string;
    media: MediaProps;
  }[];
}

export const getArticleSuggestions = cache(
  async (slug: string): Promise<ArticleSuggestionProps> => {
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
  }
);

export const getProductSuggestions = cache(
  async (slug: string): Promise<ProductSuggestionProps> => {
    const query = qs.stringify({
      filter: {
        slug,
      },
      populate: {
        products: {
          seo: { populate: '*' },
          basicInfo: { populate: '*' },
        },
      },
    });
    const data = await dataFetch(`/suggestion-lists?${query}`, [
      `suggestion-list-${slug}`,
    ]);
    return data[0];
  }
);

export const getSlides = cache(async function (
  slug: string
): Promise<SlideProps> {
  const query = qs.stringify({
    filter: {
      slug,
    },
    populate: {
      media: {
        populate: '*',
      },
    },
  });

  const data: SlideProps[] = await dataFetch(`/slides?${query}`, [
    `slide-${slug}`,
  ]);

  return data[0];
});
