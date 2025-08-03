import qs from 'qs';
import { loginCheck } from '../actions/actionMethods';
import { dataFetch, requestData } from './dataFetch';
import { CommentProps } from '../schema/commentProps';
import { FetchUserProps } from '../schema/userProps';

export const addComment = async function ({
  text,
  rate,
  productId,
}: {
  text: string;
  rate: 1 | 2 | 3 | 4 | 5;
  productId: string;
}) {
  const check = await loginCheck();
  const result = await requestData({
    qs: '/comments?status=draft',
    method: 'POST',
    body: {
      data: {
        product: productId,
        stars: rate,
        content: text,
        user: check.body.id,
      },
    },
    token: check.jwt,
  });
  return result;
};

export const getComments = async function ({
  productId,
  page = 1,
  pageSize = 10,
}: {
  productId: string;
  page?: number;
  pageSize?: number;
}) {
  const query = qs.stringify({
    filters: {
      product: { documentId: { $eq: productId } },
    },
    populate: {
      replies: { populate: '*' },
      user: { populate: '*' },
      comment: { populate: '*' },
      likes: { populate: '*' },
      dislikes: { populate: '*' },
    },
    sort: { createdAt: 'desc' },
    pagination: {
      page,
      pageSize,
    },
  });

  const result = await dataFetch({
    qs: `/comments?${query}`,
    method: 'GET',
  });
  return result;
};

export const likeAndDislikeHandler = async function ({
  type,
  comment,
}: {
  type: 'likes' | 'dislikes';
  comment: CommentProps;
}) {
  const check = await loginCheck();
  const likes: FetchUserProps[] = [];
  const dislikes: FetchUserProps[] = [];

  likes.push(...comment.likes);
  dislikes.push(...comment.dislikes);

  if (type == 'dislikes') {
    const didLike = likes.find((item) => item.id == check.body.id);
    const didDislike = dislikes.find((item) => item.id == check.body.id);
    if (didLike) {
      likes.splice(likes.indexOf(didLike));
      dislikes.push(check.body);
    } else if (didDislike) {
      dislikes.splice(likes.indexOf(didDislike));
    } else dislikes.push(check.body);
  } else {
    const didLike = likes.find((item) => item.id == check.body.id);
    const didDislike = dislikes.find((item) => item.id == check.body.id);
    if (didDislike) {
      dislikes.splice(likes.indexOf(didDislike));
      likes.push(check.body);
    } else if (didLike) {
      likes.splice(likes.indexOf(didLike));
    } else likes.push(check.body);
  }

  const res = await requestData({
    method: 'PUT',
    qs: `/comments/${comment.documentId}`,
    body: {
      data: {
        comment: comment.comment,
        content: comment.content,
        replies: comment.replies,
        stars: comment.stars,
        user: comment.user.id,
        likes: likes.map((item) => item.id),
        dislikes: dislikes.map((item) => item.id),
      },
    },
    token: check.jwt,
  });
  return res;
};
