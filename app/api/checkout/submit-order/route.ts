import qs from 'qs';

import { requestData } from '@/app/utils/data/dataFetch';
import { orderHistoryIdMaker } from '@/app/utils/shopUtils';

import { OrderHistoryProps } from '@/app/utils/schema/userProps';
import { CartProps } from '@/app/utils/schema/shopProps';

export async function POST(req: Request) {
  try {
    const orderCode = await orderHistoryIdMaker();
    const requestBody = await req.json();

    const query = qs.stringify({
      populate: {
        user: { populate: '*' },
        order: {
          populate: {
            items: {
              populate: '*',
            },
            coupon: { populate: '*' },
          },
        },
      },
    });

    const res = await requestData(
      `/order-histories/${requestBody.id}?${query}`,
      'GET',
      {},
      requestBody.jwt
    );
    const prevOrders = res.data.data.order;

    const newOrderList = prevOrders.map((order: OrderHistoryProps) => {
      return {
        orderDate: order.orderDate,
        paymentStatus: order.paymentStatus,
        payMethod: order.payMethod,
        shippingMethod: order.shippingMethod,
        shippingPrice: order.shippingPrice,
        orderPrice: order.orderPrice,
        coupon: order.coupon,
        totalPrice: order.totalPrice,
        orderCode: order.orderCode,
        address: order.address,
        firstName: order.firstName,
        lastName: order.lastName,
        province: order.province,
        city: order.city,
        phoneNumber: order.phoneNumber,
        mobileNumber: order.mobileNumber,
        postCode: order.postCode,
        items: order.items.map((item: CartProps) => ({
          count: item.count,
          product: item.product.documentId,
          variety: item.variety,
        })),
      };
    });
    newOrderList.push({ ...requestBody.order, orderCode });

    const request = {
      data: {
        order: newOrderList,
      },
    };
    const resQuery = qs.stringify({
      populate: '*',
    });

    const result = await requestData(
      `/order-histories/${requestBody.id}?${resQuery}`,
      'PUT',
      request,
      requestBody.jwt
    );

    const finalResponse = result.data.data.order.find(
      (item: OrderHistoryProps) => item.orderCode == orderCode
    );

    return Response.json({ data: finalResponse }, { status: 200 });
  } catch (error) {
    return Response.json({ error: error }, { status: 500 });
  }
}
