import { getCategoriesUrl, getCategory } from '@/app/utils/data/getCategories';
import {
  getCategoryHierarchy,
  getPostsByCategory,
} from '@/app/utils/data/getPosts';
import {
  getCategoryparentHierarchy,
  getShopCategoriesUrl,
  getShopCategory,
} from '@/app/utils/data/getProductCategories';
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest } from 'next/server';
import { createHash } from 'node:crypto';
import { dataFetch } from '@/app/utils/data/dataFetch';
import qs from 'qs';

export async function POST(request: NextRequest) {
  const token = request.headers.get('token');
  if (!token) return new Response('invalid request', { status: 400 });

  if (
    process.env.SECRET_KEY != createHash('sha256').update(token).digest('hex')
  ) {
    return new Response('invalid request', { status: 400 });
  }
  const body = await request.json();

  switch (body.model) {
    //----------blog post
    case 'post':
      (async function () {
        revalidatePath(
          `/blog/posts/${body.entry.basicInfo.contentCode}`,
          'layout'
        );
        const mainCategory = await getCategory(body.entry.category.slug);
        const categoryArray = [mainCategory[0].slug];
        const getCategoryParent = await getCategoryHierarchy(
          mainCategory[0].parentCategories,
          'parentCategories'
        );
        getCategoryParent.forEach((e) => categoryArray.push(e.slug));
        categoryArray.forEach(async (e) => {
          const url = await getCategoriesUrl(e);
          revalidatePath(`/blog/category/${url}`, 'layout');
        });
        revalidatePath(`/blog/author/${body.entry.author.username}`, 'layout');
        revalidateTag('post');
      })();
      break;

    //----------author
    case 'author':
      (async function () {
        revalidatePath(`/blog/author/${body.entry.author.username}`, 'layout');
        revalidateTag('author');
      })();
      break;

    //----------product page
    case 'product':
      (async function () {
        revalidatePath(
          `/shop/products/${body.entry.basicInfo.contentCode}`,
          'layout'
        );

        const url = await getShopCategoriesUrl(body.entry.category);
        const categories = url.split('/');
        categories.forEach(async (singleCategory) => {
          const getSingleCategory = await getShopCategory(singleCategory, [
            'shop-category',
          ]);
          const singleCategoryUrl = await getShopCategoriesUrl(
            getSingleCategory[0]
          );
          revalidatePath(`/shop/category/${singleCategoryUrl}`, 'layout');
        });
      })();
      break;

    //----------shop category
    case 'shop-category':
      (async function () {
        revalidatePath(`/shop/category/${body.entry.slug}`, 'layout');
        revalidateTag('shop-category-breadcrumb');
        revalidateTag('shop-category');
        const category = await getShopCategory(body.entry.slug);
        const categoryArray = await getCategoryparentHierarchy(category[0]);
        categoryArray.forEach(async (item) => {
          const shopCategoryUrl = await getShopCategoriesUrl(item.slug);
          revalidatePath(`/shop/category/${shopCategoryUrl}`, 'layout');
        });
      })();
      break;

    //----------blog category
    case 'category':
      (async function () {
        revalidateTag('category-breadcrumb');
        revalidateTag('category');
        const category = await getCategory(body.entry.slug);
        const categoriesSlugs = [category[0].slug];
        const getCategoriesParent = await getCategoryHierarchy(
          category[0].parentCategories,
          'parentCategories'
        );
        getCategoriesParent.forEach((e) => categoriesSlugs.push(e.slug));
        categoriesSlugs.forEach(async (e) => {
          const url = await getCategoriesUrl(e);
          const postsCategory = await getCategory(e);
          const posts = await getPostsByCategory({
            category: postsCategory[0],
          });

          revalidatePath(`/blog/category/${url}`, 'layout');
          if (!posts) return;
          posts.result.forEach((post) => {
            revalidatePath(
              `/blog/posts/${post.basicInfo.contentCode}`,
              'layout'
            );
          });
        });
      })();
      break;

    //----------single pages
    case 'single-page':
      (async function () {
        revalidatePath(`/blog/pages/${body.entry.slug}`);
      })();
      break;

    //----------blog tag
    case 'tag':
      (async function () {
        revalidatePath(`/blog/tag/${body.entry.slug}`);
        revalidateTag('tag');
      })();
      break;

    //----------shop tag
    case 'shop-tag':
      (async function () {
        revalidatePath(`/shop/tag/${body.entry.slug}`);
        revalidateTag('shop-tag');
      })();
      break;

    //----------footer menu
    case 'footer-menu':
      (async function () {
        revalidateTag('footer-menu');
      })();
      break;

    //----------main menu (blog)
    case 'main-menu':
      (async function () {
        revalidateTag('main-menu');
      })();
      break;

    //----------social links
    case 'social-link-menu':
      (async function () {
        revalidateTag('social-links');
      })();
      break;

    //----------shop menu
    case 'shop-menu':
      (async function () {
        revalidateTag('shop-menu');
      })();
      break;

    //----------favorite
    case 'favorite':
      (async function () {})();
      break;

    //----------slide
    case 'slide':
      (async function () {
        if (
          body.entry.location == 'category' ||
          body.entry.location == 'brand'
        ) {
          revalidatePath(
            `/shop/${body.entry.location}/${body.entry.slug}`,
            'page'
          );
          return;
        }
        if (body.entry.location == 'homepage') {
          revalidatePath('/');
          return;
        }
        revalidatePath(`/${body.entry.location}`);
      })();
      break;

    //----------suggested blog article
    case 'suggested-article':
      (async function () {
        revalidateTag('suggested-article-' + body.entry.slug);
      })();
      break;

    //----------suggested product
    case 'suggestion-list':
      (async function () {
        revalidateTag('suggestion-list-' + body.entry.slug);
      })();
      break;

    //----------user
    case 'user':
      (async function () {})();
      break;

    //----------Coupon
    case 'coupon':
      (async function () {})();
      break;

    case 'cart':
      (async function () {
        const query = qs.stringify({
          filters: {
            user: { $null: true },
          },
        });
        const res = await dataFetch({ qs: `/carts?${query}` });
        const carts: {
          id: number;
          documentId: string;
          createdAt: string;
          updatedAt: string;
          publishedAt: string;
        }[] = res.data;
        carts.map(async (item) => {
          await dataFetch({
            qs: `/carts/${item.documentId}`,
            method: 'DELETE',
          });
        });
      })();
      break;

    case 'order-history':
      (async () => {})();
      break;

    case 'postal-information':
      (async () => {})();
      break;

    case 'verification':
      (async () => {})();
      break;

    default:
      (async function () {
        console.log(body);
      })();
      break;
  }

  return new Response(body);
}
