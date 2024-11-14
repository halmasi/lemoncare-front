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

export async function getFooterItems() {
  const parsedData = await dataFetch('/footer-menu?populate=*');
  const footerItems: FooteritemsProps[] = parsedData.item;
  return footerItems;
}
export async function getSocialLinksItems() {
  const parsedData = await dataFetch('/social-link-menu?populate=*');
  const socialLinksItems: SocialLinksProps[] = parsedData.item;
  return socialLinksItems;
}
