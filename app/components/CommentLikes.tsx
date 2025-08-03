'use client';

import { useEffect, useRef, useState } from 'react';
import {
  HiHandThumbDown,
  HiHandThumbUp,
  HiOutlineHandThumbDown,
  HiOutlineHandThumbUp,
} from 'react-icons/hi2';
// import { FetchUserProps } from '../utils/schema/userProps';
import { useDataStore } from '../utils/states/useUserdata';
import { CommentProps } from '../utils/schema/commentProps';
import { useMutation } from '@tanstack/react-query';
import { likeAndDislikeHandler } from '../utils/data/getComments';

export default function CommentLikes({
  comment,
  refreshFn,
}: {
  comment: CommentProps;
  refreshFn: () => void;
}) {
  const { user } = useDataStore();

  const like = useRef<HTMLButtonElement>(null);
  const dislike = useRef<HTMLButtonElement>(null);

  const [likeHover, setLikeHover] = useState(false);
  const [dislikeHover, setDislikeHover] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const likeAndDislikeFn = useMutation({
    mutationFn: async (like: boolean) => {
      const res = await likeAndDislikeHandler({
        type: like ? 'likes' : 'dislikes',
        comment,
      });
      return { res, like };
    },
    onSuccess: ({ res, like }) => {
      if (res.status < 200 || res.status >= 300) return;
      if (like) setLiked(!liked);
      else setDisliked(!disliked);
      refreshFn();
    },
  });

  useEffect(() => {
    if (comment.likes && comment.dislikes) {
      const didLike = comment.likes.find((item) => item.id == user?.id);
      const didDislike = comment.dislikes.find((item) => item.id == user?.id);
      if (didLike) {
        setLiked(true);
        setDisliked(false);
      }
      if (didDislike) {
        setDisliked(true);
        setLiked(false);
      }
    }
  }, [user, likeAndDislikeFn.isPending]);

  return (
    <div className="flex gap-2 items-center">
      <button
        className="flex items-center gap-2"
        onClick={() => {
          if (user) {
            likeAndDislikeFn.mutate(true);
          }
        }}
        onMouseEnter={() => {
          setLikeHover(true);
        }}
        onMouseLeave={() => {
          setLikeHover(false);
        }}
        ref={like}
      >
        <p className="w-5">{comment.likes.length}</p>
        {liked ? (
          <HiHandThumbUp className="text-accent-green" />
        ) : likeHover ? (
          <HiHandThumbUp />
        ) : (
          <HiOutlineHandThumbUp />
        )}
      </button>
      <button
        className="flex items-center gap-2"
        onClick={() => {
          if (user) {
            likeAndDislikeFn.mutate(false);
          }
        }}
        onMouseEnter={() => {
          setDislikeHover(true);
        }}
        onMouseLeave={() => {
          setDislikeHover(false);
        }}
        ref={dislike}
      >
        {disliked ? (
          <HiHandThumbDown className="text-accent-pink" />
        ) : dislikeHover ? (
          <HiHandThumbDown />
        ) : (
          <HiOutlineHandThumbDown />
        )}
        <p className="w-5">{comment.dislikes.length}</p>
      </button>
    </div>
  );
}
