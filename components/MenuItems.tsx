import MenuButton from './MenuButton';

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

export default async function MenuItems() {
  const apiData = await fetch(
    process.env.BACKEND_PATH + '/categories?populate=*'
  );
  const parsedData = await apiData.json();
  const categoryItems: MenuProps[] = parsedData.data;
  const menuItems = categoryItems.map((item) => {
    if (item.parentCategories.length === 0) return item;
  });
  return (
    <>
      {menuItems.map((item) => {
        if (item)
          return (
            <div className="flex flex-col group">
              <MenuButton
                key={item.id}
                slug={item.slug}
                submenu={item.childCategories}
              >
                {item.title}
              </MenuButton>
              <div className="hidden bg-white group-hover:block hover:block">
                {item.childCategories.length > 0 && (
                  <div className="absolute top-auto p-3">
                    {item.childCategories.map((subItem) => (
                      <MenuButton
                        submenu={subItem.childCategories}
                        slug={subItem.slug}
                      >
                        {subItem.title}
                      </MenuButton>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
      })}
    </>
  );
}
