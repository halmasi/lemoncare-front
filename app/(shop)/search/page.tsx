'use client';

import { PostsProps } from '@/app/utils/schema/blogProps';
import { ProductProps } from '@/app/utils/schema/shopProps';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import LoadingAnimation from '@/app/components/LoadingAnimation';

export default function page() {
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
    <div className="w-full flex flex-col items-center ">
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
                    <div className="flex flex-col w-full">
                      {products.map((item) => (
                        <Link
                          href={`/shop/product/${item.basicInfo.contentCode}`}
                          key={item.id}
                          className="w-full flex flex-col md:flex-row items-center justify-start gap-3 p-2 border-y border-gray-200"
                        >
                          <Image
                            src={item.basicInfo.mainImage.formats.thumbnail.url}
                            alt={item.basicInfo.title}
                            width={
                              item.basicInfo.mainImage.formats.thumbnail.width
                            }
                            height={
                              item.basicInfo.mainImage.formats.thumbnail.height
                            }
                            className="w-32 object-contain rounded-lg"
                          />
                          <h5>{item.basicInfo.title}</h5>
                          <p>{item.seo.seoDescription}</p>
                        </Link>
                      ))}
                    </div>
                  )}
                  {/* Render product search results here */}
                </div>
              ) : (
                <div className="w-full" id="posts-tab">
                  <h2>
                    جستجوی <span className="text-accent-pink">{query}</span> در
                    مقالات
                  </h2>
                  {posts.length > 0 && (
                    <div className="flex flex-col w-full">
                      {posts.map((item) => (
                        <Link
                          href={`/shop/product/${item.basicInfo.contentCode}`}
                          key={item.id}
                          className="w-full flex flex-col md:flex-row items-center justify-start p-2 gap-3 border-y border-gray-200"
                        >
                          <Image
                            src={item.basicInfo.mainImage.formats.thumbnail.url}
                            alt={item.basicInfo.title}
                            width={
                              item.basicInfo.mainImage.formats.thumbnail.width
                            }
                            height={
                              item.basicInfo.mainImage.formats.thumbnail.height
                            }
                            className="w-32 object-contain rounded-lg"
                          />
                          <h5>{item.basicInfo.title}</h5>
                          <p>{item.seo.seoDescription}</p>
                        </Link>
                      ))}
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
    </div>
  );
}
