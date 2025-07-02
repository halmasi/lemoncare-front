import { dataFetch, requestData } from '@/app/utils/data/dataFetch';
import { NextRequest } from 'next/server';
import qs from 'qs';

export async function POST(request: NextRequest) {
  try {
    const {
      userDocumentId,
      jwt,
      location,
    }: { userDocumentId: string; jwt: string; location: 'email' | 'phone' } =
      await request.json();

    const nowDate = new Date();
    // const date = nowDate.toISOString();

    const checkAllItems = await requestData({
      qs: `/verifications`,
      method: 'GET',
      token: jwt,
    });

    checkAllItems.data.data.forEach(
      async (item: {
        createdAt: string;
        location: 'email' | 'phone';
        documentId: string;
      }) => {
        const dateObject = new Date(item.createdAt);
        if (
          (item.location == 'phone' &&
            Math.abs(nowDate.getTime() - dateObject.getTime()) / (1000 * 60) >
              2) ||
          (item.location == 'email' &&
            Math.abs(nowDate.getTime() - dateObject.getTime()) / (1000 * 60) >
              60)
        ) {
          await requestData({
            qs: `/verifications/${item.documentId}`,
            method: 'DELETE',
            token: jwt,
          });
        }
      }
    );

    const query = qs.stringify({
      filters: { user: { documentId: { $eq: userDocumentId } } },
      populate: { user: { populate: '*' } },
    });

    const userCheckResult = await requestData({
      qs: `/verifications?${query}`,
      method: 'GET',
      token: jwt,
    });

    if (userCheckResult.data.meta.pagination.total) {
      const dateObject = new Date(userCheckResult.data.data[0].createdAt);
      return Response.json(
        JSON.stringify({
          result:
            120 - Math.abs(nowDate.getTime() - dateObject.getTime()) / 1000,
        }),
        {
          status: 400,
        }
      );
    }

    const randomCode = (Math.random() * 1000000).toFixed();

    const createResult = await requestData({
      qs: `/verifications?${query}`,
      method: 'POST',
      body: {
        data: { user: userDocumentId, code: randomCode, location },
      },
      token: jwt,
    });

    if (createResult.status >= 200 && createResult.status < 300) {
      //TODO: add kavehnegar api to send SMS

      return Response.json(
        JSON.stringify({
          result: 'code was created',
        }),
        {
          status: 200,
        }
      );
    }
  } catch (err) {
    return Response.json({ error: 'error' + err }, { status: 200 });
  }
}
export async function GET() {
  const randomCode = (Math.random() * 1000000).toFixed();
  console.log(randomCode);
  return Response.json(JSON.stringify({ randomCode }), {
    status: 200,
  });
}
