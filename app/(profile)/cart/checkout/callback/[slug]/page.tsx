import Title from '@/app/components/Title';
import { getSingleOrderHistory } from '@/app/utils/data/getUserInfo';
import Link from 'next/link';

import successfulSvg from '@/public/successful.svg';
import unsuccessfulSvg from '@/public/unsuccessful.svg';
import Image from 'next/image';
import NotFound from '@/app/not-found';

export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const order = await getSingleOrderHistory(parseInt(slug));
  if (!order) return <div className="w-full">{NotFound()}</div>;

  if (order && order.order.paymentStatus != 'completed')
    return (
      <div className="w-full max-w-screen-lg">
        <Title underLineClass={'bg-accent-pink'} className="mb-5">
          <h5>پرداخت ناموفق بود</h5>
        </Title>
        <div className="w-full flex flex-col gap-5 items-center">
          <Image
            src={unsuccessfulSvg}
            alt="payment not completed"
            height={300}
            width={300}
          />
          {order && (
            <Link
              className="hover:opacity-75"
              href={'/dashboard/orderhistory/' + order.order.orderCode}
            >
              <strong>مشاهده جزئیات و پیگیری سفارش: </strong>
              <span className="text-accent-pink">{order.order.orderCode}</span>
            </Link>
          )}
        </div>
      </div>
    );

  if (
    order &&
    order.order.orderCode &&
    order.order.paymentStatus == 'completed'
  ) {
    return (
      <div className="w-full max-w-screen-lg">
        <Title className="mb-5">
          <h5>پرداخت با موفقیت انجام شد</h5>
        </Title>
        <div className="w-full flex flex-col gap-5 items-center">
          <Image
            src={successfulSvg}
            alt="payment completed"
            height={300}
            width={300}
          />
          <Link
            className="hover:opacity-75"
            href={'/dashboard/orderhistory/' + order.order.orderCode}
          >
            <strong>مشاهده جزئیات و پیگیری سفارش: </strong>
            <span className="text-accent-pink">{order.order.orderCode}</span>
          </Link>
        </div>
      </div>
    );
  }
}
