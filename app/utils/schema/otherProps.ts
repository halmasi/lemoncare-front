import { ImageProps } from 'next/image';
import { PostsProps } from './blogProps/postProps';
import { ProductProps } from './shopProps/productProps';
import { MediaProps } from './mediaProps';

export interface GravatarProps {
  hash: string;
  display_name: string;
  profile_url: string;
  avatar_url: string;
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

export interface ArticleSuggestionProps {
  title: string;
  slug: string;
  posts: PostsProps[];
}

export interface ProductSuggestionProps {
  title: string;
  slug: string;
  products: ProductProps[];
}

export interface SlideProps {
  slug: string;
  location: 'homepage' | 'shop' | 'blog' | 'category' | 'brand';
  medias: {
    link: string;
    media: MediaProps;
  }[];
}
