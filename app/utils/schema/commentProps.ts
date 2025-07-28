import { FetchUserProps } from './userProps';

export interface CommentProps {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  stars: 1 | 2 | 3 | 4 | 5;
  content: string;
  likes: FetchUserProps[];
  dislikes: FetchUserProps[];
  replies: CommentProps[];
  user: FetchUserProps;
  comment: CommentProps;
}
