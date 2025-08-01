import { dataFetch } from '@/app/utils/data/dataFetch';
import qs from 'qs';

export async function POST(req: Request) {
  const body = await req.json();

  const queryPost = qs.stringify({
    filters: {
      $or: [
        { basicInfo: { title: { $containsi: body.param } } },
        { basicInfo: { contentCode: { $containsi: body.param } } },
        { content: { $containsin: body.param } },
        { tags: { title: { $containsi: body.param } } },
        { category: { title: { $containsi: body.param } } },
        { category: { description: { $containsi: body.param } } },
      ],
    },
    populate: {
      seo: { populate: '*' },
      author: { populate: 1 },
      basicInfo: { populate: ['mainImage'] },
      category: { populate: '*' },
    },
    pagination: {
      page: body.page || 1,
      pageSize: body.pageSize || 10,
    },
    sort: { createdAt: 'desc' },
  });

  const queryProducts = qs.stringify({
    filters: {
      $or: [
        { basicInfo: { title: { $containsi: body.param } } },
        { basicInfo: { contentCode: { $containsi: body.param } } },
        { detailes: { $containsin: body.param } },
        { seo: { seoTitle: { $containsin: body.param } } },
        { seo: { seoDescription: { $containsin: body.param } } },
        { tags: { title: { $containsi: body.param } } },
        { category: { title: { $containsi: body.param } } },
        { category: { description: { $containsi: body.param } } },
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
      page: body.page || 1,
      pageSize: body.pageSize || 10,
    },
    sort: { createdAt: 'desc' },
  });

  const result1 = await dataFetch({ qs: `/posts?${queryPost}` });
  const result2 = await dataFetch({ qs: `/products?${queryProducts}` });
  return Response.json([{ posts: result1.data, products: result2.data }]);
}
