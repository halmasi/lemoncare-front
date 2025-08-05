'use client';

import ProductCart from './ProductCart';
import { getShopCategory } from '@/app/utils/data/getProductCategories';
import {
  getProducts,
  getProductsByBrand,
  getProductsByCategory,
  getProductsByTag,
} from '@/app/utils/data/getProducts';
import { notFound } from 'next/navigation';
import { ProductProps } from '../utils/schema/shopProps';
import Pagination from './Pagination';
import { useMutation } from '@tanstack/react-query';
import { Fragment, useEffect, useState } from 'react';
import ProductAndBlogSkeleton from './ProductAndBlogSkeleton';
import PostCard from './PostCard';
import { PostsProps } from '../utils/schema/blogProps';
import {
  getPosts,
  getPostsByAuthor,
  getPostsByCategory,
  getPostsByTag,
} from '../utils/data/getPosts';
import { getCategory } from '../utils/data/getCategories';
import Fillters from './Fillters';

export default function ProductsAndBlogPage({
  resultBy,
  slug,
  type,
  pageSize = 10,
  page = 1,
}: {
  resultBy: 'full' | 'category' | 'tag' | 'author' | 'brand';
  type: 'post' | 'product';
  slug: string[];
  pageSize?: number;
  page?: number;
}) {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [posts, setPosts] = useState<PostsProps[]>([]);
  const [pageCount, setPageCount] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState<string>('');

  const getProductsFn = useMutation({
    mutationFn: async () => {
      let productsList: ProductProps[] = [];
      if (resultBy == 'full') {
        setTitle('');
        const getFn = await getProducts({ page, pageSize });
        setPageCount(getFn.meta.pagination.pageCount);
        productsList = getFn.res;
      } else if (resultBy == 'category') {
        const category = await getShopCategory(slug[slug.length - 1]);
        setTitle('دسته بندی: ' + category[0].title);
        const getFn = await getProductsByCategory({
          category: category[0],
          page,
          pageSize,
        });
        setPageCount(getFn.meta.pagination.pageCount);
        productsList = getFn.res;
      } else if (resultBy == 'tag') {
        const getFn = await getProductsByTag({
          slug: slug[0],
          page,
          pageSize,
        });
        productsList = getFn.res;
        if (productsList.length == 0) return notFound();
        const tagTitle =
          productsList[0].tags[
            productsList[0].tags.findIndex((item) => item.slug == slug[0])
          ].title;
        setTitle('برچسب: ' + tagTitle || '');
        setPageCount(getFn.meta.pagination.pageCount);
      } else if (resultBy == 'brand') {
        if (slug.length > 1) {
          const category = await getShopCategory(slug[slug.length - 1]);
          const getFn = await getProductsByCategory({
            category: category[0],
            page,
            pageSize,
          });
          productsList = getFn.res;
          if (productsList.length == 0) return notFound();
          setTitle(
            'دسته بندی: ' +
              productsList[0].brand.title +
              ' | ' +
              category[0].title || ''
          );
          setPageCount(getFn.meta.pagination.pageCount);
          //
        } else {
          const getFn = await getProductsByBrand({
            slug: slug[0],
            page,
            pageSize,
          });
          productsList = getFn.res;
          if (productsList.length == 0) return notFound();
          setTitle(productsList[0].brand.title);
          setPageCount(getFn.meta.pagination.pageCount);
        }
      }
      return productsList;
    },
    onSuccess: (data) => {
      setIsLoading(false);
      if (!data || data.length == 0) return notFound();
      setProducts(data);
    },
    onError: () => {
      return notFound();
    },
  });

  const getPostsFn = useMutation({
    mutationFn: async () => {
      let postsList: PostsProps[] = [];
      if (resultBy == 'author') {
        const res = await getPostsByAuthor({ slug: slug[0], page, pageSize });
        postsList = res.posts;
        setTitle('');
        setPageCount(res.meta.pagination.pageCount);
      } else if (resultBy == 'category') {
        const category = await getCategory(slug[0]);
        setTitle('دسته بندی: ' + category[0].title);
        const posts = await getPostsByCategory({
          category: category[0],
          page,
          pageSize,
        });
        if (posts) {
          postsList = posts.result;
          setPageCount(posts.meta.pagination.pageCount);
        }
      } else if (resultBy == 'tag') {
        const posts = await getPostsByTag({ slug: slug[0], page, pageSize });
        if (posts.result[0].tags.length)
          setTitle(
            'برچسب: ' +
              posts.result[0].tags[
                posts.result[0].tags.findIndex((item) => item.slug == slug[0])
              ].title
          );
        postsList = posts.result;
        setPageCount(posts.meta.pagination.pageCount);
      } else {
        const data = await getPosts({ page, pageSize, tag: ['post'] });
        postsList = data.result;
        setPageCount(data.meta.pagination.pageCount);
      }
      return postsList;
    },
    onSuccess: (data) => {
      setIsLoading(false);
      setPosts(data);
    },
  });

  useEffect(() => {
    if (type == 'product') getProductsFn.mutate();
    else if (type == 'post') {
      getPostsFn.mutate();
    }
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-accent-pink">{title}</h4>
      {type == 'post' ? (
        <div className="grid grid-flow-row grid-cols-1 md:grid-cols-3 gap-3">
          {isLoading ? (
            <ProductAndBlogSkeleton count={10} />
          ) : (
            posts.map((post: PostsProps) => {
              return (
                <PostCard
                  key={post.documentId}
                  basicInfo={post.basicInfo}
                  category={post.category}
                  seo={post.seo}
                  authorName={post.author.name}
                  authorSlug={post.author.username}
                  authorEmail={post.author.email}
                />
              );
            })
          )}
        </div>
      ) : (
        <div className="flex gap-5">
          <Fillters products={products} />
          <div className="w-full grid grid-flow-row grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {isLoading ? (
              <ProductAndBlogSkeleton count={10} />
            ) : (
              products.map((item) => (
                <Fragment key={item.id}>
                  <ProductCart product={item} />
                  <ProductCart product={item} />
                  <ProductCart product={item} />
                  <ProductCart product={item} />
                  <ProductCart product={item} />
                </Fragment>
              ))
            )}
          </div>
        </div>
      )}
      <Pagination
        className="mt-24"
        currentPage={page}
        pageCount={pageCount}
        query="p"
      />
    </div>
  );
}
