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

export async function getMenuItems() {
  const apiData = await fetch(
    process.env.BACKEND_PATH + '/main-menu?populate[items][populate]=*'
  );
  const parsedData = await apiData.json();
  const menuItems: MenuProps[] = parsedData.data.items;
  return menuItems;
}
