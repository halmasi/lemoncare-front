import qs from 'qs';

import { requestData } from '@/app/utils/data/dataFetch';
import { orderHistoryIdMaker } from '@/app/utils/shopUtils';

export async function POST(req: Request) {
  try {
    const orderCode = await orderHistoryIdMaker();
    const requestBody = await req.json();

    const request = {
      data: {
        user: requestBody.user,
        order: { ...requestBody.order, orderCode },
      },
    };
    console.log(request);
    const query = qs.stringify({
      populate: '*',
    });

    const result = await requestData(
      `/order-histories?${query}`,
      'POST',
      request,
      requestBody.jwt
    );

    console.log(result.data.data.order.orderCode);

    return Response.json({ data: result.data.data.order }, { status: 200 });
  } catch (error) {
    return Response.json({ error: error }, { status: 500 });
  }
}
