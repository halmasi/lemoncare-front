import { cache } from 'react';
import { dataFetch } from './dataFetch';
import {
  FooteritemsProps,
  MenuProps,
  SocialLinksProps,
} from '@/app/utils/schema/menuProps';

export const getMenuItems = cache(async function () {
  const parsedData = await dataFetch({
    qs: '/main-menu?populate[items][populate]=*',
    tag: ['main-menu'],
    cache: 'force-cache',
  });
  const menuItems: MenuProps[] = parsedData.data.items;
  return menuItems;
});

export const getFooterItems = cache(async function (): Promise<
  FooteritemsProps[]
> {
  const parsedData = await dataFetch({
    qs: '/footer-menu?populate=*',
    tag: ['footer-menu'],
    cache: 'force-cache',
  });
  const footerItems: FooteritemsProps[] = parsedData.data.item;
  return footerItems;
});

export const getSocialLinksItems = cache(async function (): Promise<
  SocialLinksProps[]
> {
  const parsedData = await dataFetch({
    qs: '/social-link-menu?populate=*',
    tag: ['social-links'],
    cache: 'force-cache',
  });
  const socialLinksItems: SocialLinksProps[] = parsedData.data.item;
  return socialLinksItems;
});

export const getShopMenuItems = cache(async function () {
  // const parsedData = await dataFetch('/shop-menu?populate[items][populate]=*', [
  //   'shop-menu',
  // ]);
  const parsedData = await dataFetch({
    qs: '/shop-menu?populate=*',
    tag: ['shop-menu'],
    cache: 'force-cache',
  });
  const menuItems: MenuProps[] = parsedData.data.menuItems;
  return menuItems;
});
