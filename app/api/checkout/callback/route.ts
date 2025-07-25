import {
  getSingleOrderHistory,
  updateOrderHistory,
} from '@/app/utils/data/getUserInfo';

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

      const result: {
        CardNo: string;
        TransDate: string;
        TransNo: string;
        TraceNo: number;
        MerchantID: string;
        TerminalID: string;
        OrderID: string;
        RefNo: number;
        Amount: number;
        AmountWage: number;
        AmountWageTyp: number;
        AmntWageCbi: number;
        AmntWageCbiTyp: number;
        InvoiceNo: string;
        ExtraInf: string;
        AppExtraInf: {
          PayTyp: number;
          PayTypID: number;
          PayerNm: string;
          PayerMobile: string;
          PayerEmail: string;
          Descr: string;
          PayTitleID: number;
          PayerIP: string;
          PayerAppTyp: string;
          PayerAppID: string;
          PayerAppNm: string;
          PayerNCode: string;
        };
        Token: string;
        ResCod: number;
        Message: string;
      } = await res.json();

      if (result.ResCod == 0) {
        const order = await getSingleOrderHistory(
          parseInt(result.InvoiceNo),
          true
        );
        if (order) {
          await updateOrderHistory(order.documentId, {
            order: {
              ...order.order,
              orderDetail: result,
              paymentStatus: 'completed',
              payMethod: 'online',
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
