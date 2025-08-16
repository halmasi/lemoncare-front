'use client';

import ProductCart from './ProductCart';
import {
  getCategoryparentHierarchy,
  getShopCategory,
} from '@/app/utils/data/getProductCategories';
import {
  getProducts,
  getProductsByBrand,
  getProductsByCategory,
  getProductsByTag,
} from '@/app/utils/data/getProducts';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import { ProductProps } from '../utils/schema/shopProps';
import Pagination from './Pagination';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
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
import { BiFilter, BiSort } from 'react-icons/bi';

export default function ProductsAndBlogPage({
  resultBy,
  slug,
  type,
  pageSize = 20,
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
  const router = useRouter();

  const [allProducts, setAllProducts] = useState<ProductProps[]>([]);
  const [allPosts, setAllPosts] = useState<PostsProps[]>([]);
  const [products, setProducts] = useState<ProductProps[]>([]);
  // const [posts, setPosts] = useState<PostsProps[]>([]);
  const [pageCount, setPageCount] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showSort, setShowSort] = useState(false);
  const [showfilter, setShowFilter] = useState(false);
  const [title, setTitle] = useState<string>('');

  const getProductsFn = useMutation({
    mutationFn: async () => {
      let productsList: ProductProps[] = [];
      if (resultBy == 'full') {
        setTitle('');
        const getFn = await getProducts({ isFetchAll: true });
        setPageCount(Math.round(getFn.res.length / 10 + 0.4));
        productsList = getFn.res;
      } else if (resultBy == 'category') {
        const category = await getShopCategory(slug[slug.length - 1]);
        setTitle('دسته بندی: ' + category[0].title);
        const getFn = await getProductsByCategory({
          category: category[0],
          isSiteMap: true,
        });
        setPageCount(Math.round(getFn.res.length / 10 + 0.4));
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
        setPageCount(Math.round(getFn.res.length / 10 + 0.4));
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
          setPageCount(Math.round(getFn.res.length / 10 + 0.4));
        } else {
          const getFn = await getProductsByBrand({
            slug: slug[0],
            isFetchAll: true,
          });
          productsList = getFn.res;
          if (productsList.length == 0) return notFound();
          setTitle(productsList[0].brand.title);
          setPageCount(Math.round(getFn.res.length / 10 + 0.4));
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

  const filterFn = async (data: ProductProps[]) => {
    let filteredProducts = [...data];

    if (currentCategories.length > 0) {
      const results = await Promise.all(
        filteredProducts.map(async (item) => {
          const parents = await getCategoryparentHierarchy(item.category);
          let isIncloud = false;
          parents.map((i) => {
            if (currentCategories.includes(i.slug)) {
              isIncloud = true;
            }
          });
          return isIncloud || currentCategories.includes(item.category.slug);
        })
      );
      filteredProducts = filteredProducts.filter((_, i) => results[i]);
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
    setPageCount(Math.round(filteredProducts.length / pageSize + 0.4));

    setProducts(filteredProducts.slice((page - 1) * pageSize, page * pageSize));
  };

  const sortFn = (param: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get('sort') == param) return;
    setShowSort(false);
    params.set('sort', param);
    router.push(`?${params.toString()}`);
    filterFn(allProducts);
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
          <div className="flex justify-between items-center">
            <div
              onClick={() => setShowFilter(!showSort)}
              tabIndex={0}
              onBlur={() => setShowFilter(false)}
            >
              <div className="flex md:hidden items-center text-accent-pink cursor-pointer">
                <p>فیلتر</p>
                <BiFilter />
              </div>
              {showfilter && (
                <div className="absolute w-full top-0 z-10 h-screen bg-background">
                  <p
                    onClick={() => setShowFilter(false)}
                    className="text-accent-pink cursor-pointer"
                  >
                    X
                  </p>
                  <Fillters products={allProducts} />
                </div>
              )}
            </div>
            <div
              onClick={() => setShowSort(!showSort)}
              tabIndex={0}
              onBlur={() => setShowSort(false)}
              className="flex flex-col gap-3 items-end justify-self-end"
            >
              <p className="flex items-center text-accent-pink cursor-pointer">
                <BiSort /> مرتب سازی
              </p>
              {showSort && (
                <div className="absolute flex flex-col mt-10 border-2 rounded-lg p-5 px-10 bg-white z-10 gap-2">
                  <p
                    onClick={() => sortFn('price-desc')}
                    className="cursor-pointer hover:text-accent-pink"
                  >
                    قیمت کم به زیاد
                  </p>
                  <p
                    onClick={() => sortFn('price-asc')}
                    className="cursor-pointer hover:text-accent-pink"
                  >
                    قیمت زیاد به کم
                  </p>
                  <p
                    onClick={() => sortFn('desc')}
                    className="cursor-pointer hover:text-accent-pink"
                  >
                    جدیدترین
                  </p>
                  <p
                    onClick={() => sortFn('asc')}
                    className="cursor-pointer hover:text-accent-pink"
                  >
                    قدیمی ترین
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-5">
            <div className="hidden md:flex md:w-4/12">
              <Fillters products={allProducts} />
            </div>
            <div className="w-full grid grid-flow-row grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {isLoading ? (
                <ProductAndBlogSkeleton count={10} />
              ) : (
                products.map((item) => (
                  <ProductCart key={item.id} product={item} />
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
