'use client';

import { useEffect, useState } from 'react';

import { useDataStore } from '../utils/states/useUserdata';
import AuthForm from './profile/auth/AuthForm';
import Title from './Title';
import NewCommentForm from './NewCommentForm';
import SubmitButton from './formElements/SubmitButton';
import { useMutation } from '@tanstack/react-query';
import { getComments } from '../utils/data/getComments';
import { CommentProps } from '../utils/schema/commentProps';
import Gravatar from './profile/Gravatar';
import CommentLikes from './CommentLikes';
import Pagination from './Pagination';
import { useSearchParams } from 'next/navigation';
import { FaStar } from 'react-icons/fa';

export default function CommentSection({ productId }: { productId: string }) {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('cp') || '1');

  const { user } = useDataStore();

  const [showForm, setShowForm] = useState<boolean>(false);
  const [commnets, setComments] = useState<CommentProps[]>([]);
  const [pageCount, setPageCount] = useState<number>(1);

  const get = useMutation({
    mutationFn: async () => {
      const res = await getComments({ productId, page });
      return res;
    },
    onSuccess: (data) => {
      setComments(data.data);
      setPageCount(data.meta.pagination.pageCount);
    },
  });

  useEffect(() => {
    get.mutate();
  }, []);

  return (
    <div className="w-full max-w-screen-lg place-self-center flex flex-col gap-5 bg-gray-100 p-10 rounded-lg border">
      <Title className="mb-5">
        <h6>دیدگاه ها</h6>
      </Title>
      {!showForm && (
        <SubmitButton
          onClick={() => {
            setShowForm(true);
          }}
        >
          ثبت دیدگاه
        </SubmitButton>
      )}
      {showForm && !user && <AuthForm />}
      {showForm && user && <NewCommentForm productId={productId} />}
      {get.isPending ? (
        <div></div>
      ) : commnets && commnets.length > 0 ? (
        <>
          {commnets.map((item, index) => (
            <div
              className="border rounded-lg overflow-hidden border-gray-300"
              key={index}
            >
              <div className="w-full justify-between flex gap-5 items-center bg-gray-200 text-accent-pink p-2">
                <div className="flex gap-5 items-center bg-gray-200 text-accent-pink">
                  <Gravatar emailAddress={item.user.email} />
                  <p className="">{item.user.fullName}</p>
                </div>
                <div className="flex gap-1">
                  <FaStar className="text-accent-yellow" />
                  <FaStar
                    className={`${item.stars > 1 ? 'text-accent-yellow' : 'text-gray-300'}`}
                  />
                  <FaStar
                    className={`${item.stars > 2 ? 'text-accent-yellow' : 'text-gray-300'}`}
                  />
                  <FaStar
                    className={`${item.stars > 3 ? 'text-accent-yellow' : 'text-gray-300'}`}
                  />
                  <FaStar
                    className={`${item.stars > 4 ? 'text-accent-yellow' : 'text-gray-300'}`}
                  />
                </div>
                <p className="text-gray-500 justify-self-end pl-1 lg:pl-5">
                  {new Date(item.createdAt).toLocaleDateString('fa-IR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className="bg-gray-50">
                <p className="p-1">{item.content}</p>
                <div className="w-full flex justify-between px-10">
                  <div></div>
                  <CommentLikes
                    refreshFn={() => {
                      get.mutate();
                    }}
                    comment={item}
                  />
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <>دیدگاهی ثبت نشده، اولین نفر باشید</>
      )}
      <Pagination pageCount={pageCount} query={'cp'} />
      {/* <div>{}</div> */}
    </div>
  );
}
