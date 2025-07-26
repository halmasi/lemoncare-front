import {
  getSingleOrderHistory,
  updateOrderHistory,
} from '@/app/utils/data/getUserInfo';
import { CartProps } from '@/app/utils/schema/shopProps';
import { PaymentDetailProps } from '@/app/utils/schema/userProps';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const ResCod = parseInt(formData.get('ResCod')?.toString() || '1');
    const MerchantID = formData.get('MerchantID');
    const TerminalID = formData.get('TerminalID');
    const Token = formData.get('Token');

    if (ResCod == 0) {
      const res = await fetch(
        'https://rt.sizpay.ir/api/PaymentSimple/ConfirmSimple',
        {
          method: 'POST',
          body: JSON.stringify({
            Username: process.env.SIZPAY_USERNAME,
            Password: process.env.SIZPAY_PASSWORD,
            MerchantID: MerchantID,
            TerminalID: TerminalID,
            Token: Token,
            SignData: '',
          }),
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': '' + process.env.POSTEX_API_TOKEN,
          },
        }
      );

      const result: PaymentDetailProps = await res.json();

      if (result.ResCod == 0) {
        const order = await getSingleOrderHistory(
          parseInt(result.InvoiceNo),
          true
        );
        if (order) {
          const orderDeleteId = order.order;
          delete orderDeleteId.id;
          await updateOrderHistory(order.documentId, {
            order: {
              ...orderDeleteId,
              items: orderDeleteId.items.map((item: CartProps) => {
                return {
                  count: item.count || 0,
                  beforePrice: item.beforePrice || 0,
                  mainPrice: item.mainPrice || 0,
                  variety: item.variety,
                  product: item.product.documentId,
                };
              }),
              orderDetail: result,
              paymentStatus: 'completed',
              payMethod: 'online',
              deliveryStatus: 'در صف بررسی',
            },
          });
          return Response.redirect(
            `${process.env.SITE_URL}/cart/checkout/callback/${order.order.orderCode}`
          );
        }
      }
    }
    return Response.redirect(
      `${process.env.SITE_URL}/cart/checkout/callback/406`
    );
  } catch (err) {
    console.log(err);
    return Response.redirect(
      `${process.env.SITE_URL}/cart/checkout/callback/406`,
      500
    );
  }
}
