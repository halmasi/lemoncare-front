import Link from 'next/link';
import { IoIosArrowDropleft } from 'react-icons/io';
import { CgFormatSlash } from 'react-icons/cg';
import { PostsProps } from '@/app/utils/data/getPosts';
import { getCategoriesUrl, getCategory } from '@/app/utils/data/getCategories';
import { ProductProps } from '../utils/data/getProducts';
import {
  getShopCategoriesUrl,
  getShopCategory,
} from '../utils/data/getProductCategories';

export default async function Breadcrumbs({
  post,
  product,
}: {
  post?: PostsProps;
  product?: ProductProps;
}) {
  if (post) {
    const url = await getCategoriesUrl(post.category, ['category']);
    const categories = url.split('/');
    return (
      <div aria-label="breadcrumb" className="flex flex-wrap items-center">
        <p>دسته بندی</p> <IoIosArrowDropleft className="ml-3" />
        {categories.map(async (e, i) => {
          const getSingleCategory = await getCategory(e, ['category']);
          const singleCategory = getSingleCategory[0];
          const singleCategoryUrl = await getCategoriesUrl(singleCategory);
          return (
            <div key={i} className="flex flex-row items-center">
              {i > 0 && <CgFormatSlash />}
              <Link
                href={`/blog/category/${singleCategoryUrl}`}
                className="transition-colors hover:text-yellow-800"
              >
                <p>{singleCategory.title}</p>
              </Link>
            </div>
          );
        })}
      </div>
    );
  } else if (product) {
    const url = await getShopCategoriesUrl(product.category, ['category']);
    const categories = url.split('/');
    return (
      <>
        <div aria-label="breadcrumb" className="flex flex-wrap items-center">
          <p>دسته بندی</p> <IoIosArrowDropleft className="ml-3" />
          {categories.map(async (e, i) => {
            const getSingleCategory = await getShopCategory(e, ['category']);
            const singleCategory = getSingleCategory[0];
            const singleCategoryUrl =
              await getShopCategoriesUrl(singleCategory);
            return (
              <div key={i} className="flex flex-row items-center">
                {i > 0 && <CgFormatSlash />}
                <Link
                  href={`/shop/category/${singleCategoryUrl}`}
                  className="transition-colors hover:text-accent-pink"
                >
                  <p>{singleCategory.title}</p>
                </Link>
              </div>
            );
          })}
        </div>
      </>
    );
  }
  return <h6>Breadcrumb</h6>;
}
