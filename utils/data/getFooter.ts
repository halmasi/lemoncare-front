import { cache } from 'react';
import { dataFetch } from './dataFetch';

export interface FooteritemsProps {
  id: number;
  title: string;
  url: string;
}

export interface SocialLinksProps {
  id: number;
  title: 'Telegram' | 'Whatsapp' | 'Instagram';
  url: string;
}

export const getFooterItems = cache(async function (): Promise<
  FooteritemsProps[]
> {
  const parsedData = await dataFetch('/footer-menu?populate=*', [
    'footer-menu',
  ]);
  const footerItems: FooteritemsProps[] = parsedData.item;
  return footerItems;
});

export const getSocialLinksItems = cache(async function (): Promise<
  SocialLinksProps[]
> {
  const parsedData = await dataFetch('/social-link-menu?populate=*', [
    'social-links',
  ]);
  const socialLinksItems: SocialLinksProps[] = parsedData.item;
  return socialLinksItems;
});
