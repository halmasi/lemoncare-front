'use client';

import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getOrderHistory } from '@/app/utils/data/getUserInfo';
import { OrderHistoryProps } from '@/app/utils/schema/userProps';
import { useDataStore } from '@/app/utils/states/useUserdata';
import Image from 'next/image';

function LoadingSkeleton() {
  return (
    <div className="w-full justify-between overflow-hidden flex flex-wrap gap-2 h-52 bg-gray-500 animate-pulse p-2">
      <div className="p-2 h-full w-40 bg-gray-300 rounded-lg"></div>
      <div className="p-2 h-full w-40 bg-gray-300 rounded-lg"></div>
      <div className="p-2 h-full w-40 bg-gray-300 rounded-lg"></div>
      <div className="p-2 h-full w-40 bg-gray-300 rounded-lg"></div>
      <div className="p-2 h-full w-40 bg-gray-300 rounded-lg"></div>
    </div>
  );
}

export default function OrderHistory() {
  const [showLoading, setShowLoading] = useState<boolean>(true);
  const [orderHistory, setOrderHistory] = useState<OrderHistoryProps[]>([]);
  // const [showModal, setShowModal] = useState(false);
  // const [productDetails, setProductDetails] = useState<
  //   {
  //     variety: {
  //       id: number;
  //       sub: number | null;
  //     };
  //     product: cartProductsProps;
  //     count: number;
  //     color: string;
  //     priceBefore: number;
  //     priceAfter: number;
  //     name: string;
  //   }[]
  // >();

  const { user } = useDataStore();
  // const { cartProducts, setCartProducts } = useCartStore();

  const getOrderHistoryFn = useMutation({
    mutationFn: async (id: string) => {
      const orderHistoryData = await getOrderHistory(id);
      setOrderHistory(orderHistoryData.data.order || []);
      return orderHistory;
    },
    onSettled: () => {
      setShowLoading(false);
    },
  });

  useEffect(() => {
    if (user && user.order_history) {
      getOrderHistoryFn.mutateAsync(user.order_history.documentId);
    }
  }, [user, setOrderHistory]);

  // const handleOrderClick = async (order: OrderHistoryProps) => {
  // order.items.forEach(async (item) => {
  //   const productsList = await cartProductSetter(
  //     item.product.documentId,
  //     cartProducts
  //   );
  //   setCartProducts(productsList);
  // });

  // const details = Promise.all(
  //   order.items.map(async (item) => {
  //     const product = await cartProductSelector(
  //       item.product.documentId,
  //       cartProducts
  //     );
  //     const { color, priceBefforDiscount, mainPrice, specification } =
  //       varietyFinder(item.variety, product);
  //     return {
  //       variety: item.variety,
  //       product,
  //       count: item.count,
  //       color,
  //       priceBefore: priceBefforDiscount,
  //       priceAfter: mainPrice,
  //       name: specification,
  //     };
  //   })
  // );
  // setProductDetails(await details);
  // setShowModal(true);
  // };

  return (
    <div className="p-6 w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">لیست سفارشات</h2>

      {showLoading ? (
        <div className="w-full overflow-hidden">
          <LoadingSkeleton />
        </div>
      ) : orderHistory.length > 0 ? (
        <div className="flex flex-col gap-5">
          {orderHistory.map((order) => {
            return (
              <div
                key={order.id}
                className="gap-2 p-4 bg-white shadow-md hover:shadow-lg rounded-lg border transition-all duration-200 cursor-pointer space-y-2"
                // onClick={() => handleOrderClick(order)}
              >
                {order.items && order.items.length > 0 ? (
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-500">
                      تاریخ:{' '}
                      {new Date(order.orderDate).toLocaleDateString('fa-IR')}
                    </p>
                    <div className="flex flex-row mt-1 gap-3">
                      {order.items.map((product) => (
                        <div key={product.id}>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Image
                              src={
                                product?.product?.basicInfo?.mainImage?.formats
                                  ?.thumbnail?.url || '/placeholder.png'
                              }
                              alt={
                                product?.product?.basicInfo?.title || 'بدون نام'
                              }
                              width={100}
                              height={100}
                              className="rounded-md"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">
                              {product?.product?.basicInfo?.title || 'بدون نام'}
                            </p>
                            <p className="text-gray-500">
                              تعداد: {product.count}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p
                      className={`text-sm font-semibold ${
                        order.paymentStatus == 'completed'
                          ? 'text-green-600'
                          : 'text-red-500'
                      }`}
                    >
                      وضعیت پرداخت:{' '}
                      {order.paymentStatus == 'completed'
                        ? 'پرداخت شده'
                        : order.paymentStatus == 'pending'
                          ? 'در انتظار پرداخت'
                          : 'لغو شده'}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 mt-2 text-sm">
                    هیچ محصولی در این سفارش یافت نشد.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-6">هیچ سفارشی یافت نشد.</p>
      )}
      {/* <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        className="overflow-y-scroll  max-h-[90vh]"
      >
        {productDetails && productDetails.length > 0 ? (
          (() => {
            const totalPrice = productDetails.reduce(
              (sum, item) => sum + item.count * item.priceAfter,
              0
            );
            const totalDiscount = productDetails.reduce(
              (sum, item) =>
                sum + (item.priceBefore - item.priceAfter) * item.count,
              0
            );

            return (
              <div className="p-4">
                {productDetails.map((item, index) => {
                  const itemTotal = item.count * item.priceAfter;
                  const itemDiscount =
                    (item.priceBefore - item.priceAfter) * item.count;
                  const itemDiscountPercent = Math.round(
                    (itemDiscount / item.priceBefore) * 100
                  );
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 border-b pb-3 mb-4"
                    >
                      <Image
                        src={
                          item.product.basicInfo.mainImage?.formats?.thumbnail
                            ?.url || '/placeholder.png'
                        }
                        alt={item.product.basicInfo.title || 'بدون نام'}
                        width={50}
                        height={50}
                        className="rounded-md"
                      />
                      <div>
                        <p className="font-medium text-gray-800">
                          {item.product.basicInfo.title || 'بدون نام'}
                        </p>
                        <p className="text-sm text-gray-500">
                          🎨 رنگ: {item.name || 'نامشخص'}
                        </p>
                        <p className="text-sm text-gray-500">
                          🛍️ تعداد: {item.count}
                        </p>
                        <Toman className="text-sm text-gray-500 fill-gray-500">
                          <p>
                            💰 قیمت واحد: {item.priceAfter.toLocaleString()}
                          </p>
                        </Toman>
                        <p
                          className="text-sm text-red-500"
                          title={`تخفیف: ${itemDiscount.toLocaleString()} تومان`}
                        >
                          🔻 درصد تخفیف:{' '}
                          {item.priceBefore > 0
                            ? itemDiscountPercent + '%'
                            : '0%'}
                        </p>
                        <Toman className="text-sm font-semibold text-gray-800 fill-gray-800">
                          <p>💵 مجموع: {itemTotal.toLocaleString()}</p>
                        </Toman>
                      </div>
                    </div>
                  );
                })}

                <div className="border-t pt-4 mt-6">
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-700 font-semibold">
                      💰 مجموع کل:
                    </span>
                    <Toman className="text-base font-bold text-gray-900 fill-gray-900">
                      <p>{totalPrice.toLocaleString()}</p>
                    </Toman>
                  </div>

                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-700 font-semibold">
                      💸 مجموع تخفیف:
                    </span>
                    <Toman className="text-base font-bold text-red-500 fill-red-500">
                      <p>{totalDiscount.toLocaleString()}</p>
                    </Toman>
                  </div>
                </div>
              </div>
            );
          })()
        ) : (
          <p className="text-gray-500 p-4">هیچ محصولی یافت نشد.</p>
        )}
      </Modal> */}
    </div>
  );
}
