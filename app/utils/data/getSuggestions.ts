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
  medias: {
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
      populate: '*',
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
      populate: '*',
    });
    const data = await dataFetch(`/suggestion-lists?${query}`, [
      `suggestion-list-${slug}`,
    ]);
    return data[0];
  }
);

export const getSlides = cache(async function (
  location: string
): Promise<SlideProps> {
  const query = qs.stringify({
    filter: {
      location: { $eq: location },
    },
    populate: {
      medias: {
        populate: '*',
      },
    },
  });
  const data: SlideProps[] = await dataFetch(`/slideshows?${query}`, [
    `slide-${location}`,
  ]);
  return data[0];
});
