'use client';

import { PostsProps } from '@/app/utils/schema/blogProps';
import { ProductProps } from '@/app/utils/schema/shopProps';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingAnimation from '@/app/components/LoadingAnimation';
import ProductCart from '@/app/components/ProductCart';
import PostCard from '@/app/components/PostCard';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('s-query');
  //   const page = searchParams.get('s-page');

  const [searchType, setSearchType] = useState<'post' | 'product'>('product');
  const [posts, setPosts] = useState<PostsProps[]>([]);
  const [products, setProducts] = useState<ProductProps[]>([]);

  const getSearchResultFn = useMutation({
    mutationFn: async (param: string) => {
      const res = await fetch(`/api/search`, {
        method: 'POST',
        body: JSON.stringify({
          param: param,
        }),
      });
      const data = await res.json();
      return data[0];
    },
    onSuccess: (data: { posts: PostsProps[]; products: ProductProps[] }) => {
      if (!data) return;
      setPosts(data.posts);
      setProducts(data.products);
    },
  });

  useEffect(() => {
    if (query) {
      getSearchResultFn.mutate(query);
    }
  }, [query]);

  return (
    <main className="w-full flex flex-col items-center ">
      <div className="w-full flex flex-row items-center justify-center">
        <div className="w-full border-b flex flex-row gap-2 pt-2">
          <div
            className={` relative cursor-pointer border border-b-0 rounded-t-lg ${searchType == 'product' && 'bg-accent-pink text-white cursor-default'}`}
            onClick={() => {
              setSearchType('product');
            }}
          >
            {products.length != 0 && !getSearchResultFn.isPending && (
              <div className="absolute -left-2 -top-2 rounded-2xl flex items-center justify-center m-1 min-w- w-fit h-5 aspect-square p-2 border bg-accent-green">
                <p className="text-white text-xs">{products.length}</p>
              </div>
            )}
            <p className="p-2">محصولات</p>
          </div>
          <div
            className={` relative cursor-pointer border border-b-0 rounded-t-lg ${searchType == 'post' && 'bg-accent-pink text-white cursor-default'}`}
            onClick={() => {
              setSearchType('post');
            }}
          >
            {posts.length != 0 && !getSearchResultFn.isPending && (
              <div className="absolute -left-2 -top-2 rounded-2xl flex items-center justify-center m-1 min-w- w-fit h-5 aspect-square p-2 border bg-accent-green">
                <p className="text-white text-xs">{posts.length}</p>
              </div>
            )}
            <p className="p-2">مقالات</p>
          </div>
        </div>
      </div>

      {query && (
        <div className="w-full">
          {getSearchResultFn.isPending ? (
            <div className="flex flex-col items-center">
              <h6>درحال جستجو...</h6>
              <LoadingAnimation />
            </div>
          ) : products.length || posts.length ? (
            <>
              {searchType === 'product' ? (
                <div className="w-full" id="products-tab">
                  <h2>
                    جستجوی <span className="text-accent-pink">{query}</span> در
                    محصولات
                  </h2>
                  {products.length > 0 && (
                    <div className="flex flex-col container py-5 px-2 md:px-10">
                      <div className="grid grid-flow-row grid-cols-1 md:grid-cols-4 gap-3">
                        {products.map((item) => (
                          <ProductCart product={item} key={item.id} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full" id="posts-tab">
                  <h2>
                    جستجوی <span className="text-accent-pink">{query}</span> در
                    مقالات
                  </h2>
                  {posts.length > 0 && (
                    <div className="flex flex-col container max-w-screen-xl py-5 px-10 space-y-2">
                      <div className="grid grid-flow-row grid-cols-1 md:grid-cols-3 gap-3">
                        {posts.map((post) => {
                          return (
                            <PostCard
                              key={post.documentId + 'post'}
                              basicInfo={post.basicInfo}
                              category={post.category}
                              seo={post.seo}
                              authorEmail={post.author.email}
                              authorName={post.author.name}
                              authorSlug={post.author.username}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {/* Render post search results here */}
                </div>
              )}
            </>
          ) : (
            <div className="p-5 text-center text-gray-500">
              هیچ نتیجه ای پیدا نشد
            </div>
          )}
        </div>
      )}
    </main>
  );
}
