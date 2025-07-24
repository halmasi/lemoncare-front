import {
  getSingleOrderHistory,
  updateOrderHistory,
} from '@/app/utils/data/getUserInfo';
import { redirect } from 'next/navigation';

export async function POST(req: Request) {
  const request = await req.json();

  const {
    ResCod,
    MerchantID,
    TerminalID,
    Token,
    // Message,
    // InvoiceNo,
    // ExtraInf,
    // AppExtraInf,
  } = request.body;
  if (ResCod == 0 || ResCod != parseInt('00')) {
    const res = await fetch(
      'https://rt.sizpay.ir/api/PaymentSimple/ConfirmSimple',
      {
        method: 'POST',
        body: JSON.stringify({
          Username: process.env.SIZPAY_USERNAME,
          Password: process.env.SIZPAY_PASSWORD,
          MerchantID,
          TerminalID,
          Token,
          SignData: '',
        }),
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': '' + process.env.POSTEX_API_TOKEN,
        },
      }
    );
    const result: {
      ResCode: number;
      Message: string;
      MerchantID: string;
      TerminalID: string;
      OrderId: string;
      TransNo: number;
      RefNo: number;
      TraceNo: number;
      Amount: number;
      CardNo: string;
      TransDate: string;
      InvoiceNo: string;
      AppExtraInf: {
        PayerNm: string;
        PayerMobile: string;
        PayerEmail: string;
        Descr: string;
        PayerIP: string;
        PayTitleID: string;
      };
    } = await res.json();
    if (result.ResCode == 0 || result.ResCode == parseInt('00')) {
      const order = await getSingleOrderHistory(parseInt(result.InvoiceNo));
      if (order) {
        await updateOrderHistory(order.documentId, {
          orderDetails: result,
          paymentStatus: 'completed',
          PaymentMethod: 'online',
        });
        return redirect(`/cart/checkout/callback`);
      }
    }
  }
  return redirect(`/cart/checkout/callback`);
}
