import { requestData } from '@/app/utils/data/dataFetch';
import { NextRequest } from 'next/server';
import qs from 'qs';

export async function POST(request: NextRequest) {
  try {
    const {
      username,
      location = 'phone',
    }: {
      username: number;
      location?: 'email' | 'phone';
    } = await request.json();
    const nowDate = new Date();
    const checkAllItems = await requestData({
      qs: `/verifications`,
      method: 'GET',
    });
    if (checkAllItems.data)
      checkAllItems.data.forEach(
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
            });
          }
        }
      );

    const query = qs.stringify({
      filters: { user: { username: { $eq: username } } },
      populate: { user: { populate: '*' } },
    });
    const userCheckResult = await requestData({
      qs: `/verifications?${query}`,
      method: 'GET',
    });
    if (userCheckResult.data && userCheckResult.data.length > 0) {
      const dateObject = new Date(userCheckResult.data[0].createdAt);
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

    const res = await requestData({
      qs: `/auth/request-otp`,
      method: 'POST',
      body: {
        username,
        location,
      },
    });
    if (res.status >= 200 && res.status < 300) {
      return Response.json(
        JSON.stringify({
          result: 'code was sended',
        }),
        {
          status: 200,
        }
      );
    }
  } catch (err) {
    return Response.json({ error: 'error' + err }, { status: 500 });
  }
}
