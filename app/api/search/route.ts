import { dataFetch } from '@/app/utils/data/dataFetch';
import qs from 'qs';

export async function POST(req: Request) {
  const { param, productPage, postPage, pageSize = 10 } = await req.json();
  if (!param)
    return Response.json({ error: 'پارامتر یافت نشد' }, { status: 401 });
  const queryPost = qs.stringify({
    filters: {
      $or: [
        { basicInfo: { title: { $containsi: param } } },
        { basicInfo: { contentCode: { $containsi: param } } },
        { seo: { seoTitle: { $containsin: param } } },
        { seo: { seoDescription: { $containsin: param } } },
        { content: { $containsin: param } },
        { tags: { title: { $containsi: param } } },
        { category: { title: { $containsi: param } } },
        { category: { description: { $containsi: param } } },
      ],
    },
    populate: {
      seo: { populate: '*' },
      author: { populate: 1 },
      basicInfo: { populate: ['mainImage'] },
      category: { populate: '*' },
    },
    pagination: {
      page: postPage,
      pageSize,
    },
    sort: { createdAt: 'desc' },
  });

  const queryProducts = qs.stringify({
    filters: {
      $or: [
        { basicInfo: { title: { $containsi: param } } },
        { basicInfo: { contentCode: { $containsi: param } } },
        { detailes: { $containsin: param } },
        { seo: { seoTitle: { $containsin: param } } },
        { seo: { seoDescription: { $containsin: param } } },
        { tags: { title: { $containsi: param } } },
        { category: { title: { $containsi: param } } },
        { category: { description: { $containsi: param } } },
      ],
    },
    populate: {
      basicInfo: { populate: ['mainImage'] },
      seo: { populate: '*' },
      category: { populate: '*' },
      tags: { populate: '*' },
      media: { populate: 1 },
      variety: { populate: '*' },
    },
    pagination: {
      page: productPage,
      pageSize,
    },
    sort: { createdAt: 'desc' },
  });
  const result1 = await dataFetch({ qs: `/posts?${queryPost}` });
  const result2 = await dataFetch({ qs: `/products?${queryProducts}` });
  return Response.json({
    posts: result1.data,
    products: result2.data,
    postMeta: result1.meta,
    productMeta: result2.meta,
  });
}
