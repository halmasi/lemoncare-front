interface MenuBasicProps {
  id: number;
  documentId: number;
  title: string;
  slug: string;
  childCategories: [];
}
export interface MenuProps {
  id: number;
  documentId: number;
  title: string;
  slug: string;
  childCategories: MenuBasicProps[];
  parentCategories: object[] | [];
}

export async function getMenuItems() {
  const apiData = await fetch(
    process.env.BACKEND_PATH + '/categories?populate=*'
  );
  const parsedData = await apiData.json();
  const categoryItems: MenuProps[] = parsedData.data;
  const menuItems = categoryItems.map((item) => {
    if (item.parentCategories.length === 0) return item;
  });
  return menuItems;
}
