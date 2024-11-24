import { createHash } from 'node:crypto';
import { dataFetch } from './dataFetch';
import qs from 'qs';
import {
  CategoriesProps,
  getCategory,
  SubCategoryProps,
} from './getCategories';
import { cache } from 'react';

export interface PostsProps {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  content: ContentProps[];
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
  gravatar?: GravatarProps;
  categoryUrl?: string;
  author: AuthorProps;
  sources?: { id: number; sourceUrl: string; websiteName: string }[];
}
export interface GravatarProps {
  hash: string;
  display_name: string;
  profile_url: string;
  avatar_url: string;
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

export enum ContentTypes {
  heading = 'heading',
  paragraph = 'paragraph',
  image = 'image',
  list = 'list',
  quote = 'quote',
  code = 'code',
}

export interface ContentProps {
  type: ContentTypes;
  children: ContentChildrenProps[];
  format?: 'unordered' | 'ordered';
  level?: number;
  image?: ImageProps;
  language?: string;
}
export interface ContentChildrenProps {
  text?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  url?: string;
  type: 'text' | 'list-item' | 'link';
  children?: {
    text: string;
    type: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
  }[];
}

export const getPosts = cache(async function (tag?: string[], count?: number) {
  const query = qs.stringify({
    populate: {
      seo: { populate: '*' },
      author: { populate: 1 },
      basicInfo: { populate: '*' },
      category: { populate: '*' },
    },
  });
  let link = '/posts?' + query;
  if (count) {
    link += `&pagination[limit]=${count}&sort[0]=createdAt:desc`;
  }
  const result: PostsProps[] = await dataFetch(link, tag);

  return result;
});

export const getPost = cache(async function (slug: string) {
  const query = qs.stringify({
    filters: { basicInfo: { contentCode: { $eq: slug } } },
    populate: {
      seo: { populate: '*' },
      author: { populate: 1 },
      basicInfo: { populate: '*' },
      category: { populate: '*' },
      sources: { populate: '*' },
    },
  });
  const result: PostsProps[] = await dataFetch(`/posts?${query}`);
  return result;
});

export const getGravatar = cache(
  async (email: string): Promise<GravatarProps> => {
    const data = await fetch(
      process.env.GRAVATAR_URI +
        createHash('sha256').update(email).digest('hex'),
      {
        headers: {
          Authorization: 'Bearer ' + process.env.GRAVATAR_SECRET,
        },
        next: { tags: ['author'] },
      }
    );
    const gravatar: GravatarProps = await data.json();
    return gravatar;
  }
);

export const getCategoryHierarchy = cache(async function (
  category: SubCategoryProps[],
  direction: 'childCategories' | 'parentCategories',
  tag?: string[]
): Promise<CategoriesProps[]> {
  const allCategories: CategoriesProps[] = [];

  const result = await Promise.all(
    category.map(async (item) => {
      const res = await getCategory(item.slug, tag);
      return res[0];
    })
  );

  for (const e of result) {
    allCategories.push(e);
    if (e[direction] && e[direction].length > 0) {
      const fetchedCategories = await getCategoryHierarchy(
        e[direction],
        direction,
        tag
      );
      allCategories.push(...fetchedCategories);
    }
  }

  return allCategories;
});

export const getPostsByCategory = cache(async function (
  category: CategoriesProps,
  tag?: string[]
) {
  const subCategories: SubCategoryProps[] | [] =
    category.childCategories.length > 0
      ? await getCategoryHierarchy(
          category.childCategories,
          'childCategories',
          tag
        )
      : [];
  const slugs = [{ slug: { $eq: category.slug } }];
  subCategories.forEach((e) => {
    slugs.push({ slug: { $eq: e.slug } });
  });
  const query = qs.stringify({
    filters: {
      category: {
        $or: slugs,
      },
    },
    populate: {
      seo: { populate: '*' },
      author: { populate: 1 },
      basicInfo: { populate: '*' },
      category: { populate: '*' },
    },
  });
  const result: PostsProps[] = await dataFetch(
    `/posts?${query}&sort[0]=createdAt:desc`,
    tag
  );
  return result;
});
