'use client';

import ProductCart from './ProductCart';
import {
  getCategorySubHierarchy,
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
import Fillters from './Fillters';
import { BiFilter, BiSort } from 'react-icons/bi';
import { getCategory } from '../utils/data/getCategories';

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

  const filterSetter = async () => {
    const params = new URLSearchParams(searchParams.toString());
    const categories = params.getAll('category');
    const hierarchy: string[] = [];
    await Promise.all(
      categories.map(async (item) => {
        const category = await getShopCategory(item);
        const allCategoriesParents = await getCategorySubHierarchy(category);
        allCategoriesParents.map((cat) => hierarchy.push(cat.slug));
      })
    );
    const brands = params.getAll('brand');
    const filters = {
      $and: [
        {
          $or: [
            ...hierarchy.map((item) => {
              return { category: { slug: { $eq: item } } };
            }),
          ],
        },
        {
          $or: [
            ...brands.map((item) => {
              return { brand: { slug: { $eq: item } } };
            }),
          ],
        },
      ],
    };
    return filters;
  };

  const getProductsFn = useMutation({
    mutationFn: async (sortParamValue: string) => {
      setIsLoading(true);
      setProducts([]);
      let productsList: ProductProps[] = [];
      let productsListThisPage: ProductProps[] = [];
      let sort: object;
      if (sortParamValue == 'asc' || sortParamValue == 'desc') {
        sort = { createdAt: sortParam };
      } else if (sortParamValue == 'price-asc') {
        sort = { mainPrice: 'asc' };
      } else {
        sort = { mainPrice: 'desc' };
      }
      if (resultBy == 'full') {
        setTitle('');
        const getFn = await getProducts({
          isFetchAll: true,
          populate: { populate: '1' },
        });
        const getProductsFunc = await getProducts({
          page,
          pageSize,
          sort,
          filters: await filterSetter(),
        });
        setPageCount(getProductsFunc.meta.pagination.pageCount);
        productsList = getFn.res;
        productsListThisPage = getProductsFunc.res;
      } else if (resultBy == 'category') {
        const category = await getShopCategory(slug[slug.length - 1]);
        setTitle('دسته بندی: ' + category[0].title);
        if (!allProducts.length) {
          const getFn = await getProductsByCategory({
            category: category[0],
            isSiteMap: true,
            populate: { populate: '1' },
          });
          productsList = getFn.res;
        }
        const getProductsFunc = await getProductsByCategory({
          category: category[0],
          page,
          pageSize,
          sort,
          otherFilters: await filterSetter(),
        });
        setPageCount(getProductsFunc.meta.pagination.pageCount);
        productsListThisPage = getProductsFunc.res;
      } else if (resultBy == 'tag') {
        if (!allProducts.length) {
          const getFn = await getProductsByTag({
            slug: slug[0],
            isFetchAll: true,
            populate: { populate: '1' },
          });
          productsList = getFn.res;
        }
        const getProductsFunc = await getProductsByTag({
          slug: slug[0],
          page,
          pageSize,
          sort,
          otherFilters: await filterSetter(),
        });
        productsListThisPage = getProductsFunc.res;

        if (productsList.length == 0) return notFound();
        const tagTitle =
          productsList[0].tags[
            productsList[0].tags.findIndex((item) => item.slug == slug[0])
          ].title;
        setTitle('برچسب: ' + tagTitle || '');
        setPageCount(getProductsFunc.meta.pagination.pageCount);
      } else if (resultBy == 'brand') {
        if (slug.length > 1) {
          const category = await getShopCategory(slug[slug.length - 1]);
          if (!allProducts.length) {
            const getFn = await getProductsByCategory({
              category: category[0],
              brand: slug[0],
              isSiteMap: true,
              populate: { populate: '1' },
            });
            productsList = getFn.res;
          }
          const getProductsFunc = await getProductsByCategory({
            category: category[0],
            brand: slug[0],
            page,
            pageSize,
            sort,
            otherFilters: await filterSetter(),
          });
          productsListThisPage = getProductsFunc.res;

          if (productsList.length == 0) return notFound();
          setTitle(
            'دسته بندی: ' +
              productsList[0].brand.title +
              ' | ' +
              category[0].title || ''
          );
          setPageCount(getProductsFunc.meta.pagination.pageCount);
        } else {
          if (!allProducts.length) {
            const getFn = await getProductsByBrand({
              slug: slug[0],
              isFetchAll: true,
              populate: { populate: '1' },
            });
            productsList = getFn.res;
          }
          const getProductsFunc = await getProductsByBrand({
            slug: slug[0],
            page,
            pageSize,
            sort,
            otherFilters: await filterSetter(),
          });
          productsListThisPage = getProductsFunc.res;
          if (productsList.length == 0) return notFound();
          setTitle(productsList[0].brand.title);
          setPageCount(getProductsFunc.meta.pagination.pageCount);
        }
      }
      return { productsList, productsListThisPage };
    },
    onSuccess: (data) => {
      setIsLoading(false);
      if (!data || data.productsListThisPage.length == 0) return notFound();
      if (!allProducts.length) setAllProducts(data.productsList);
      setProducts(data.productsListThisPage);
      // filterFn(data);
    },
    onError: () => {
      setIsLoading(false);
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

  const sortFn = (param: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get('sort') == param) return;
    setShowSort(false);
    params.set('sort', param);
    router.push(`?${params.toString()}`);

    getProductsFn.mutate(param);
  };
  // useEffect(() => {
  //   filterFn(allProducts);
  // }, [currentBrands.length, currentCategories.length]);

  useEffect(() => {
    if (type == 'product') getProductsFn.mutate(sortParam);
    else if (type == 'post') {
      getPostsFn.mutate();
    }
  }, [params.toString()]);

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
                    className="text-accent-pink cursor-pointer p-1"
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
                <div
                  className={`absolute flex flex-col mt-10 border-2 rounded-lg p-5 px-10 bg-white z-10 gap-2 `}
                >
                  <p
                    onClick={() => sortFn('price-desc')}
                    className={`px-2 rounded-md w-full cursor-pointer hover:text-accent-pink ${sortParam == 'price-desc' && 'bg-gray-500/20'}`}
                  >
                    قیمت زیاد به کم
                  </p>
                  <p
                    onClick={() => sortFn('price-asc')}
                    className={`px-2 rounded-md w-full cursor-pointer hover:text-accent-pink ${sortParam == 'price-asc' && 'bg-gray-500/20'}`}
                  >
                    قیمت کم به زیاد
                  </p>
                  <p
                    onClick={() => sortFn('desc')}
                    className={`px-2 rounded-md w-full cursor-pointer hover:text-accent-pink ${sortParam == 'desc' && 'bg-gray-500/20'}`}
                  >
                    جدیدترین
                  </p>
                  <p
                    onClick={() => sortFn('asc')}
                    className={`px-2 rounded-md w-full cursor-pointer hover:text-accent-pink ${sortParam == 'asc' && 'bg-gray-500/20'}`}
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
