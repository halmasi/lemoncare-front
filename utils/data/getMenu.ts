import { cache } from 'react';
import { dataFetch } from './dataFetch';

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
