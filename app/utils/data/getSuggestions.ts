import qs from 'qs';

import { dataFetch } from './dataFetch';
import { cache } from 'react';
import {
  ArticleSuggestionProps,
  ProductSuggestionProps,
  SlideProps,
} from '@/app/utils/schema/otherProps';

export const getArticleSuggestions = cache(
  async (slug: string): Promise<ArticleSuggestionProps> => {
    const query = qs.stringify({
      filter: {
        slug,
      },
      populate: '*',
    });
    const data = await dataFetch(`/suggested-articles?${query}`, 'GET', [
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
    const data = await dataFetch(`/suggestion-lists?${query}`, 'GET', [
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
  const data: SlideProps[] = await dataFetch(`/slideshows?${query}`, 'GET', [
    `slide-${location}`,
  ]);
  return data[0];
});
