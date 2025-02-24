import Link from 'next/link';
import { IoIosArrowDropleft } from 'react-icons/io';
import { CgFormatSlash } from 'react-icons/cg';
import { getCategoriesUrl, getCategory } from '@/app/utils/data/getCategories';
import {
  getShopCategoriesUrl,
  getShopCategory,
} from '../utils/data/getProductCategories';
import { PostsProps } from '../utils/schema/blogProps/postProps';
import { ProductProps } from '../utils/schema/shopProps/productProps';

export default async function Breadcrumbs({
  post,
  product,
}: {
  post?: PostsProps;
  product?: ProductProps;
}) {
  if (post) {
    const url = await getCategoriesUrl(post.category, ['category-breadcrumb']);
    const categories = url.split('/');
    return (
      <div aria-label="breadcrumb" className="flex flex-wrap items-center">
        <p>دسته بندی</p> <IoIosArrowDropleft className="ml-3" />
        {categories.map(async (e, i) => {
          const getSingleCategory = await getCategory(e, ['category']);
          const singleCategory = getSingleCategory[0];
          const singleCategoryUrl = await getCategoriesUrl(singleCategory, [
            'category-breadcrumb',
          ]);
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
    const url = await getShopCategoriesUrl(product.category, [
      'shop-category-breadcrumb',
    ]);
    const categories = url.split('/');
    return (
      <div aria-label="breadcrumb" className="flex flex-wrap items-center">
        <p>دسته بندی</p> <IoIosArrowDropleft className="ml-3" />
        {categories.map(async (e, i) => {
          const getSingleCategory = await getShopCategory(e, ['shop-category']);
          const singleCategory = getSingleCategory[0];
          const singleCategoryUrl = await getShopCategoriesUrl(singleCategory, [
            'shop-category-breadcrumb',
          ]);
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
    );
  }
  return <h6>Breadcrumb</h6>;
}
