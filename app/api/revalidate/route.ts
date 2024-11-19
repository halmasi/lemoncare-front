import {
  getCategoriesUrlBySlug,
  getCategory,
} from '@/utils/data/getCategories';
import { getCategoryHierarchy } from '@/utils/data/getPosts';
import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // console.log(request.headers);
  //   const res = request.cookies.get("token")?.value;
  //   console.log(res);
  return new Response(request.body);
}
export async function POST(request: NextRequest) {
  //validate token
  console.log(request.headers.get('token'));

  const body = await request.json();
  let config = {};

  switch (body.model) {
    case 'post':
      revalidatePath(`/posts/${body.entry.basicInfo.contentCode}`);
      const getMainCategory = await getCategory(body.entry.category.slug);
      const mainCategory = getMainCategory[0];
      const categoryArray = [getMainCategory[0].slug];
      const getCategories = await getCategoryHierarchy(
        mainCategory.parentCategories,
        'parentCategories'
      );
      getCategories.forEach((e) => categoryArray.push(e.slug));
      categoryArray.map(async (e) => {
        const url = await getCategoriesUrlBySlug(e);
        revalidatePath(url, 'layout');
      });
      revalidatePath(`/author/${body.entry.author.username}`);
      break;
    case 'author':
      revalidatePath(`/author/${body.entry.author.username}`);
      break;

    case 'category':
      const getMainCategorybySlug = await getCategory(body.entry.slug);
      const category = getMainCategorybySlug[0];
      const categoriesSlugs = [category.slug];
      const getCategoriesParent = await getCategoryHierarchy(
        category.parentCategories,
        'parentCategories'
      );
      const getCategoriesChildren = await getCategoryHierarchy(
        category.parentCategories,
        'childCategories'
      );
      getCategoriesParent.forEach((e) => categoryArray.push(e.slug));
      getCategoriesChildren.forEach((e) => categoryArray.push(e.slug));
      categoriesSlugs.map(async (e) => {
        const url = await getCategoriesUrlBySlug(e);
        revalidatePath(url, 'layout');
      });
      revalidatePath('/posts', 'layout');
      break;

    case 'single-page':
      config = {
        singlePost: body.entry.slug,
      };
      break;

    case 'tag':
      config = {
        tag: body.entry.slug,
      };
      break;

    case 'footer-menu':
      config = {
        footerMenu: body.entry,
      };
      break;

    case 'main-menu':
      config = {
        mainMenu: body.entry,
      };
      break;

    case 'social-link-menu':
      config = {
        socialLinkMenu: body.entry,
      };
      break;

    default:
      console.log(body);
      break;
  }

  console.log(config);
  return new Response(body);
}
