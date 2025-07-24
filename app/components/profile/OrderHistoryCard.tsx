import { OrderHistoryProps } from '@/app/utils/schema/userProps';
import Image from 'next/image';
import Link from 'next/link';
import { RiArrowLeftSLine } from 'react-icons/ri';
import Toman from '../Toman';

export default function OrderHistoryCard({
  item,
}: {
  item: OrderHistoryProps;
}) {
  const order = item.order;
  return (
    <Link
      href={`/dashboard/orderhistory/${order.orderCode}`}
      className="w-full gap-2 p-4 bg-white shadow-md hover:shadow-lg rounded-lg border transition-all duration-200 cursor-pointer space-y-2"
    >
      {order.items && order.items.length > 0 ? (
        <div className="w-full flex flex-col">
          <div className="w-full flex justify-between border-b">
            <div>
              <div
                className={`text-sm w-full flex flex-wrap items-center gap-1 p-1`}
              >
                <div className="flex flex-wrap p-2 gap-2 text-sm">
                  <p className="text-gray-500">
                    {new Date(order.orderDate).toLocaleDateString('fa-IR')}
                  </p>
                </div>
                <div className="flex flex-wrap p-2 gap-2 text-sm ">
                  <p className="text-gray-500">وضعیت پرداخت: </p>
                  <p
                    className={`font-semibold ${
                      order.paymentStatus == 'completed'
                        ? 'text-accent-green/75'
                        : 'text-accent-pink/75'
                    }`}
                  >
                    {order.paymentStatus == 'completed'
                      ? 'پرداخت شده'
                      : order.paymentStatus == 'pending'
                        ? 'در انتظار پرداخت'
                        : 'لغو شده'}
                  </p>
                </div>
                <div className="flex flex-wrap p-2 gap-2 text-sm ">
                  <p className="text-gray-500">شناسه سفارش: </p>
                  <p>{order.orderCode}</p>
                </div>
              </div>
              <div
                className={`text-sm w-full flex flex-wrap items-center gap-1 p-1`}
              >
                <div className="flex flex-wrap p-2 gap-2 text-sm ">
                  <p className="text-gray-500">مبلغ: </p>
                  <Toman className="fill-accent-green text-accent-green">
                    <p>{(order.totalPrice / 10).toLocaleString('fa-IR')}</p>
                  </Toman>
                </div>

                {
                  <div className="flex flex-wrap p-2 gap-2 text-sm ">
                    {(() => {
                      let offer = 0;
                      order.items.forEach((item) => {
                        if (
                          item.beforePrice &&
                          item.beforePrice > 0 &&
                          item.mainPrice
                        ) {
                          offer += item.beforePrice - item.mainPrice;
                          console.log(item.beforePrice - item.mainPrice);
                        }
                      });
                      return (
                        <>
                          <p className="text-gray-500">
                            {offer > 0 && 'تخفیف:'}
                          </p>
                          {offer > 0 && (
                            <Toman className="fill-accent-green text-accent-green">
                              <p>
                                {(
                                  (order.orderPrice - offer) /
                                  10
                                ).toLocaleString('fa-IR')}
                              </p>
                            </Toman>
                          )}
                        </>
                      );
                    })()}
                  </div>
                }
              </div>
            </div>
            <p className="self-center p-2 w-fit hover:text-accent-pink transition-colors">
              <RiArrowLeftSLine />
            </p>
          </div>
          <div className="w-full flex flex-row mt-1 gap-3 p-1">
            {(() => {
              const i = order.items.slice(0, 4);
              return i.map((product, index) => (
                <Image
                  key={product.id}
                  src={
                    product?.product?.basicInfo?.mainImage?.formats?.thumbnail
                      ?.url || '/placeholder.png'
                  }
                  alt={product?.product?.basicInfo?.title || 'بدون نام'}
                  width={100}
                  height={100}
                  className={`w-16 h-26 rounded-full aspect-square object-cover border-background border-2 ${index > 0 && '-mr-8'}`}
                />
              ));
            })()}
            {order.items.length > 4 && (
              <div className="flex items-center justify-center w-16 h-16 rounded-full aspect-square object-cover border-2 bg-background/85 -mr-8">
                <p>{order.items.length - 4}+</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 mt-2 text-sm">
          هیچ محصولی در این سفارش یافت نشد.
        </p>
      )}
    </Link>
  );
}
