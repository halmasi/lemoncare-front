import { getCategoriesUrl, getCategory } from '@/utils/data/getCategories';
import {
  getCategoryHierarchy,
  getPostsByCategory,
} from '@/utils/data/getPosts';
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest } from 'next/server';
import { createHash } from 'node:crypto';

export async function POST(request: NextRequest) {
  const token = request.headers.get('token');
  if (!token) return new Response('invalid request', { status: 400 });

  if (
    process.env.SECRET_KEY != createHash('sha256').update(token).digest('hex')
  )
    return new Response('invalid request', { status: 400 });

  const body = await request.json();

  switch (body.model) {
    case 'post':
      revalidatePath(`/posts/${body.entry.basicInfo.contentCode}`);
      const getMainCategory = await getCategory(body.entry.category.slug);
      const mainCategory = getMainCategory[0];
      const categoryArray = [getMainCategory[0].slug];
      const getCategoryParent = await getCategoryHierarchy(
        mainCategory.parentCategories,
        'parentCategories'
      );
      getCategoryParent.forEach((e) => categoryArray.push(e.slug));
      categoryArray.map(async (e) => {
        const url = await getCategoriesUrl(e);
        revalidatePath(`/category/${url}`, 'layout');
      });
      revalidatePath(`/author/${body.entry.author.username}`, 'layout');
      revalidateTag('post');
      break;

    case 'author':
      revalidatePath(`/author/${body.entry.author.username}`, 'layout');
      revalidateTag('author');
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
        const url = await getCategoriesUrl(e);
        const postsCategory = await getCategory(e);
        const posts = await getPostsByCategory(postsCategory[0]);
        revalidatePath(`/category/${url}`, 'layout');
        posts.map((post) => {
          revalidatePath(`/posts/${post.basicInfo.contentCode}`, 'layout');
        });
      });
      break;

    case 'single-page':
      revalidatePath(`/pages/${body.entry.slug}`);
      break;

    case 'tag':
      revalidatePath(`/tag/${body.entry.slug}`);
      revalidateTag('tag');
      break;

    case 'footer-menu':
      revalidateTag('footer-menu');
      break;

    case 'main-menu':
      revalidateTag('main-menu');
      break;

    case 'social-link-menu':
      revalidateTag('social-links');
      break;

    default:
      console.log(body);
      break;
  }

  return new Response(body);
}
