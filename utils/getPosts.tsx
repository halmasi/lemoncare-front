export interface PostsProps {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  content: object[];
  category: CategoriesProps;
  tags: object[];
  seo: { id: number; seoTitle: string; seoDescription: string };
  basicInfo: {
    id: number;
    title: string;
    mainImage: ImageProps;
    contentCode: number;
  };
  view: number | null;
  source: string[];
}

export interface SubCategoryProps {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  posts: PostsProps[];
  childCategories: CategoriesProps[];
  parentCategories: CategoriesProps[];
}

export interface CategoriesProps {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  posts: PostsProps[];
  childCategories: SubCategoryProps[];
  parentCategories: SubCategoryProps[];
}

export interface ImageProps {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    large: {
      ext: string;
      url: string;
      name: string;
      width: number;
      height: number;
    };
    small: {
      ext: string;
      url: string;
      name: string;
      width: number;
      height: number;
    };
    medium: {
      ext: string;
      url: string;
      name: string;
      width: number;
      height: number;
    };
    thumbnail: {
      ext: string;
      url: string;
      name: string;
      width: number;
      height: number;
    };
  };
  ext: string;
  url: string;
}

export async function getCategoriesUrl(
  category: CategoriesProps
): Promise<string> {
  const rawData = await fetch(
    `${process.env.BACKEND_PATH}/categories/${category.documentId}?populate[parentCategories][populate]=*`
  );
  const data = await rawData.json();
  const result: CategoriesProps = data.data;
  if (result.parentCategories.length > 0)
    return (
      (await getCategoriesUrl(result.parentCategories[0])) + '/' + result.slug
    );
  return result.slug;
}

export async function getPosts(count?: number) {
  let link =
    '/posts?populate[basicInfo][populate]=*&populate[seo][populate]=*&populate[category][populate]=*';
  if (count) {
    link += `&pagination[limit]=${count}&sort[0]=createdAt:desc`;
  }

  const rawData = await fetch(process.env.BACKEND_PATH + link);
  const data = await rawData.json();
  const result: PostsProps[] = data.data;
  return result;
}

export async function getPost(documentId: string) {
  const rawData = await fetch(
    `${process.env.BACKEND_PATH}/posts/${documentId}?populate=*`
  );
  const data = await rawData.json();
  const result: PostsProps[] = data.data;
  return result;
}

// export async function getPostsByCategory(category: string) {
//   const rawData = await fetch(
//     `${process.env.BACKEND_PATH}/categories/${category}?populate[posts][populate]=*`,
//     {}
//   );
//   const data = await rawData.json();
//   const result: PostsProps[] = data.data.map((item: CategoriesProps) => {
//     if (item.posts !== undefined && item.posts.length >= 1) return item.posts;
//   });

//   return result;
// }
