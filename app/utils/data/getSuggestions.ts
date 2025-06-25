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
    const data = await dataFetch({
      qs: `/suggested-articles?${query}`,
      tag: [`suggested-article-${slug}`],
      cache: 'force-cache',
    });
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
    const data = await dataFetch({
      qs: `/suggestion-lists?${query}`,
      tag: [`suggestion-list-${slug}`],
      cache: 'force-cache',
    });
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
  const data: SlideProps[] = await dataFetch({
    qs: `/slideshows?${query}`,
    tag: [`slide-${location}`],
    cache: 'force-cache',
  });
  return data[0];
});
