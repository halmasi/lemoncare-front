import { cache } from 'react';
import { dataFetch } from './dataFetch';
import {
  FooteritemsProps,
  MenuProps,
  SocialLinksProps,
} from '@/app/utils/schema/menuProps';

export const getMenuItems = cache(async function () {
  const parsedData = await dataFetch(
    '/main-menu?populate[items][populate]=*',
    'GET',
    ['main-menu']
  );
  const menuItems: MenuProps[] = parsedData.items;
  return menuItems;
});

export const getFooterItems = cache(async function (): Promise<
  FooteritemsProps[]
> {
  const parsedData = await dataFetch('/footer-menu?populate=*', 'GET', [
    'footer-menu',
  ]);
  const footerItems: FooteritemsProps[] = parsedData.item;
  return footerItems;
});

export const getSocialLinksItems = cache(async function (): Promise<
  SocialLinksProps[]
> {
  const parsedData = await dataFetch('/social-link-menu?populate=*', 'GET', [
    'social-links',
  ]);
  const socialLinksItems: SocialLinksProps[] = parsedData.item;
  return socialLinksItems;
});

export const getShopMenuItems = cache(async function () {
  // const parsedData = await dataFetch('/shop-menu?populate[items][populate]=*', [
  //   'shop-menu',
  // ]);
  const parsedData = await dataFetch('/shop-menu?populate=*', 'GET', [
    'shop-menu',
  ]);
  const menuItems: MenuProps[] = parsedData.menuItems;
  return menuItems;
});
