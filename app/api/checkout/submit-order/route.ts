import qs from 'qs';

import { requestData } from '@/app/utils/data/dataFetch';
import { orderHistoryIdMaker } from '@/app/utils/shopUtils';
import { getCoupon } from '@/app/utils/data/getCoupons';
import { getSingleOrderHistory } from '@/app/utils/data/getUserInfo';

export async function POST(req: Request) {
  try {
    const orderCode = await orderHistoryIdMaker();
    const requestBody = await req.json();
    const request = {
      data: {
        user: requestBody.user,
        order: {
          ...requestBody.order,
          orderCode,
          deliveryStatus: 'در انتظار پرداخت',
        },
      },
    };
    const query = qs.stringify({
      populate: '*',
    });
    if (requestBody.coupon) {
      const coupon = await getCoupon({ couponCode: requestBody.coupon });
      request.data.order = {
        ...request.data.order,
        coupon: coupon.data.documentId,
      };
    }
    const result = await requestData({
      qs: `/order-histories`,
      method: 'POST',
      body: request,
      token: requestBody.jwt,
    });

    const res = await getSingleOrderHistory(orderCode, true);

    return Response.json(
      { data: res?.order || { error: 'error' } },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error: error }, { status: 500 });
  }
}
