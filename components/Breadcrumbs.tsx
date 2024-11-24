import Link from 'next/link';
import { IoIosArrowDropleft } from 'react-icons/io';
import { CgFormatSlash } from 'react-icons/cg';
import { PostsProps } from '@/utils/data/getPosts';
import {
  getCategoriesUrl,
  getCategoriesUrlBySlug,
  getCategory,
} from '@/utils/data/getCategories';

export default async function Breadcrumbs({ post }: { post: PostsProps }) {
  const url = await getCategoriesUrl(post.category, ['category']);
  const categories = url.split('/');
  return (
    <div aria-label="breadcrumb" className="flex flex-row items-center">
      <p>دسته بندی</p> <IoIosArrowDropleft className="ml-3" />
      {categories.map(async (e, i) => {
        const getSingleCategory = await getCategory(e, ['category']);
        const singleCategory = getSingleCategory[0];
        const singleCategoryUrl = await getCategoriesUrlBySlug(e, ['category']);
        return (
          <div key={i} className="flex flex-row items-center">
            {i > 0 && <CgFormatSlash />}
            <Link
              href={`/category/${singleCategoryUrl}`}
              className="transition-colors hover:text-yellow-800"
            >
              <p>{singleCategory.title}</p>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
