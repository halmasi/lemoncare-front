import { createHash } from 'node:crypto';
import { dataFetch } from './dataFetch';

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
  gravatar?: GravatarProps;
  categoryUrl?: string;
  author: AuthorProps;
}
export interface GravatarProps {
  hash: string;
  display_name: string;
  profile_url: string;
  avatar_url: string;
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

export interface AuthorProps {
  id: number;
  documentId: string;
  name: string;
  username: string;
  description: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  posts: PostsProps[];
}

export async function getCategoriesUrl(
  category: CategoriesProps
): Promise<string> {
  const result: CategoriesProps = await dataFetch(
    `/categories/${category.documentId}?populate[parentCategories][populate]=*`
  );
  if (result.parentCategories.length > 0)
    return (
      (await getCategoriesUrl(result.parentCategories[0])) + '/' + result.slug
    );
  return result.slug;
}

export async function getPosts(count?: number) {
  let link =
    '/posts?populate[basicInfo][populate]=*&populate[seo][populate]=*&populate[category][populate]=*&populate[author][populate]=1';
  if (count) {
    link += `&pagination[limit]=${count}&sort[0]=createdAt:desc`;
  }
  const result: PostsProps[] = await dataFetch(link);
  return result;
}

export async function getPost(documentId: string) {
  const result: PostsProps[] = await dataFetch(
    `${process.env.BACKEND_PATH}/posts/${documentId}?populate=*`
  );
  return result;
}

export const getGravatar = async (email: string): Promise<GravatarProps> => {
  const data = await fetch(
    process.env.GRAVATAR_URI + createHash('sha256').update(email).digest('hex'),
    {
      headers: {
        Authorization: 'Bearer ' + process.env.GRAVATAR_SECRET,
      },
    }
  );
  const gravatar: GravatarProps = await data.json();
  return gravatar;
};

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
