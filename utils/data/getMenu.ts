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

interface SubMenuProps {
  id: number;
  title: string;
  url: string;
}

interface SubMenuProps {
  id: number;
  documentId: string;
  name: string;
  width: number;
  height: number;
  url: string;
}

export interface MenuProps {
  id: number;
  title: string;
  url: string;
  subMenu: SubMenuProps[] | [];
  image: SubMenuProps | null;
}

export const getMenuItems = cache(async function () {
  const parsedData = await dataFetch('/main-menu?populate[items][populate]=*', [
    'main-menu',
  ]);
  const menuItems: MenuProps[] = parsedData.items;
  return menuItems;
});

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

export const getShopMenuItems = cache(async function () {
  // const parsedData = await dataFetch('/shop-menu?populate[items][populate]=*', [
  //   'shop-menu',
  // ]);
  const parsedData = await dataFetch('/shop-menu?populate=*', ['shop-menu']);
  const menuItems: MenuProps[] = parsedData.menuItems;
  return menuItems;
});
