export interface PostsProps {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  content: object[];
  category: CategoriesProps[];
  tags: object[];
  seo: { id: number; seoTitle: string; seoDescription: string };
  basicInfo: {
    id: number;
    title: string;
    contentCode: number;
  };
  view: number | null;
  source: string[];
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
}
export async function getPosts() {
  const rawData = await fetch(`${process.env.BACKEND_PATH}/posts?populate=*`);
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
