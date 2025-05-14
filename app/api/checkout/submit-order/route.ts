import { dataFetch } from '@/app/utils/data/dataFetch';
import { orderHistoryIdMaker } from '@/app/utils/shopUtils';
import qs from 'qs';

export async function POST(req: Request) {
  const code = await orderHistoryIdMaker();

  const requestBody = await req.json();
  console.log(requestBody);

  // const request = await req.json();
  //   const sending = await fetch('https://api.postex.ir/api/v1/shipping-price', {
  //     method: 'POST',
  //     body: JSON.stringify(request),
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'x-api-key': '' + process.env.POSTEX_API_TOKEN,
  //     },
  //   });
  //   const result = await sending.json();
  return Response.json({ asdasd: 'asdasd' }, { status: 200 });
}
