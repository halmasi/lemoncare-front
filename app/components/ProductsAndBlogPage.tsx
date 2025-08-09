'use client';

import ProductCart from './ProductCart';
import { getShopCategory } from '@/app/utils/data/getProductCategories';
import {
  getProducts,
  getProductsByBrand,
  getProductsByCategory,
  getProductsByTag,
} from '@/app/utils/data/getProducts';
import { notFound, useSearchParams } from 'next/navigation';
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
import { s } from 'framer-motion/client';
import { BiSort } from 'react-icons/bi';

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
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const currentCategories = params.getAll('category');
  const currentBrands = params.getAll('brand');
  const sortParam = params.get('sort') || 'asc';

  const [allProducts, setAllProducts] = useState<ProductProps[]>([]);
  const [allPosts, setAllPosts] = useState<PostsProps[]>([]);
  const [products, setProducts] = useState<ProductProps[]>([]);
  // const [posts, setPosts] = useState<PostsProps[]>([]);
  const [pageCount, setPageCount] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showSort, setShowSort] = useState(false);
  const [title, setTitle] = useState<string>('');

  const getProductsFn = useMutation({
    mutationFn: async () => {
      let productsList: ProductProps[] = [];
      if (resultBy == 'full') {
        setTitle('');
        const getFn = await getProducts({ isFetchAll: true });
        setPageCount(Math.round(getFn.res.length / 10 + 0.5));
        productsList = getFn.res;
      } else if (resultBy == 'category') {
        const category = await getShopCategory(slug[slug.length - 1]);
        setTitle('دسته بندی: ' + category[0].title);
        const getFn = await getProductsByCategory({
          category: category[0],
          isSiteMap: true,
        });
        setPageCount(Math.round(getFn.res.length / 10 + 0.5));
        productsList = getFn.res;
      } else if (resultBy == 'tag') {
        const getFn = await getProductsByTag({
          slug: slug[0],
          isFetchAll: true,
        });
        productsList = getFn.res;
        if (productsList.length == 0) return notFound();
        const tagTitle =
          productsList[0].tags[
            productsList[0].tags.findIndex((item) => item.slug == slug[0])
          ].title;
        setTitle('برچسب: ' + tagTitle || '');
        setPageCount(Math.round(getFn.res.length / 10 + 0.5));
      } else if (resultBy == 'brand') {
        if (slug.length > 1) {
          const category = await getShopCategory(slug[slug.length - 1]);
          const getFn = await getProductsByCategory({
            category: category[0],
            isSiteMap: true,
          });
          productsList = getFn.res;
          if (productsList.length == 0) return notFound();
          setTitle(
            'دسته بندی: ' +
              productsList[0].brand.title +
              ' | ' +
              category[0].title || ''
          );
          setPageCount(Math.round(getFn.res.length / 10 + 0.5));
          //
        } else {
          const getFn = await getProductsByBrand({
            slug: slug[0],
            isFetchAll: true,
          });
          productsList = getFn.res;
          if (productsList.length == 0) return notFound();
          setTitle(productsList[0].brand.title);
          setPageCount(Math.round(getFn.res.length / 10 + 0.5));
        }
      }
      return productsList;
    },
    onSuccess: (data) => {
      setIsLoading(false);
      if (!data || data.length == 0) return notFound();
      setAllProducts(data);
      filterFn(data);
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
      setAllPosts(data);
    },
  });

  const filterFn = (data: ProductProps[]) => {
    let filteredProducts = [...data];

    if (currentCategories.length > 0) {
      filteredProducts = filteredProducts.filter((item) =>
        currentCategories.includes(item.category.slug)
      );
    }

    if (currentBrands.length > 0) {
      filteredProducts = filteredProducts.filter((item) =>
        currentBrands.includes(item.brand.slug)
      );
    }
    if (sortParam == 'asc') {
      filteredProducts.sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
    } else if (sortParam == 'desc') {
      filteredProducts.sort((a, b) => {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
    } else if (sortParam == 'price-asc') {
      filteredProducts.sort((a, b) => {
        const priceA = a.variety.reduce((min, item) => {
          const lowest = item.subVariety.length
            ? Math.min(...item.subVariety.map((sub) => sub.mainPrice))
            : item.mainPrice;
          return Math.min(min, lowest);
        }, Infinity);
        const priceB = b.variety.reduce((min, item) => {
          const lowest = item.subVariety.length
            ? Math.min(...item.subVariety.map((sub) => sub.mainPrice))
            : item.mainPrice;
          return Math.min(min, lowest);
        }, Infinity);
        return priceA - priceB;
      });
    } else if (sortParam == 'price-desc') {
      filteredProducts.sort((a, b) => {
        const priceA = a.variety.reduce((max, item) => {
          const highest = item.subVariety.length
            ? Math.max(...item.subVariety.map((sub) => sub.mainPrice))
            : item.mainPrice;
          return Math.max(max, highest);
        }, -Infinity);
        const priceB = b.variety.reduce((max, item) => {
          const highest = item.subVariety.length
            ? Math.max(...item.subVariety.map((sub) => sub.mainPrice))
            : item.mainPrice;
          return Math.max(max, highest);
        }, -Infinity);
        return priceB - priceA;
      });
    }

    setProducts(filteredProducts);
  };

  useEffect(() => {
    filterFn(allProducts);
  }, [currentBrands.length, currentCategories.length]);

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
            allPosts.map((post: PostsProps) => {
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
        <div className="flex flex-col gap-5">
          <div
            onClick={() => setShowSort(!showSort)}
            tabIndex={0}
            onBlur={() => setShowSort(false)}
            className="flex flex-col gap-3 items-end"
          >
            <p className="flex items-center text-accent-pink cursor-pointer">
              <BiSort /> مرتب سازی
            </p>
            {showSort && (
              <div className="absolute flex flex-col mt-10 border-2 rounded-lg p-5 px-10 bg-white z-10 gap-2">
                <p className="cursor-pointer hover:text-accent-pink">
                  قیمت کم به زیاد
                </p>
                <p className="cursor-pointer hover:text-accent-pink">
                  قیمت زیاد به کم
                </p>
                <p className="cursor-pointer hover:text-accent-pink">
                  جدیدترین
                </p>
                <p className="cursor-pointer hover:text-accent-pink">
                  قدیمی ترین
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-5">
            <Fillters products={allProducts} />
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
        </div>
      )}
      <Pagination className="mt-24" pageCount={pageCount} />
    </div>
  );
}
