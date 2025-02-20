import { ImageProps } from '../mediaProps';
import { AuthorProps, ContentProps, GravatarProps } from '../otherProps';
import { CategoriesProps, TagsProps } from './tagsAndCategoryProps';

export interface PostsProps {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  content: ContentProps[];
  category: CategoriesProps;
  tags: TagsProps[];
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
