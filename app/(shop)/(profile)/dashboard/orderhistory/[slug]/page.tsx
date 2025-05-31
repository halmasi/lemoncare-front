'use client';

import SubmitButton from '@/app/components/formElements/SubmitButton';
import LoadingAnimation from '@/app/components/LoadingAnimation';
import Toman from '@/app/components/Toman';
import { getSingleOrderHistory } from '@/app/utils/data/getUserInfo';
import { cartProductsProps } from '@/app/utils/schema/shopProps';
import { OrderHistoryProps } from '@/app/utils/schema/userProps';
import {
  cartProductSelector,
  cartProductSetter,
  varietyFinder,
} from '@/app/utils/shopUtils';
import { useCartStore } from '@/app/utils/states/useCartData';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, use } from 'react';
import { CiMoneyBill } from 'react-icons/ci';
import {
  FaMoneyCheck,
  FaRegMoneyBillAlt,
  FaShippingFast,
} from 'react-icons/fa';
import { FaBuildingUser, FaUserTag } from 'react-icons/fa6';
import { GrStatusGood } from 'react-icons/gr';
import { IoQrCode } from 'react-icons/io5';
import { LiaShippingFastSolid } from 'react-icons/lia';
import { LuCalendarClock } from 'react-icons/lu';
import { toast } from 'react-toastify';

export default function page(props: { params: Promise<{ slug: string }> }) {
  const params = use(props.params);
  const { slug } = params;

  const { user } = useDataStore();
  const { setCartProducts, cartProducts } = useCartStore();

  const [orderData, setOrderData] = useState<OrderHistoryProps>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<
    {
      product: cartProductsProps;
      count: number;
      color: string;
      priceBefore: number;
      priceAfter: number;
      name: string;
    }[]
  >([]);

  const getOrderHistoryFn = useMutation({
    mutationFn: async () => {
      if (user) {
        const res = await getSingleOrderHistory(
          user.order_history.documentId,
          parseInt(slug)
        );
        return res;
      }
    },
    onSuccess: async (data: OrderHistoryProps) => {
      if (!data) return;
      setOrderData(data);
      await Promise.all(
        data.items.map(async (item) => {
          const productsList = await cartProductSetter(
            item.product.documentId,
            cartProducts
          );

          setCartProducts(productsList);

          const product = await cartProductSelector(
            item.product.documentId,
            cartProducts
          );
          const { color, priceBefforDiscount, mainPrice, specification } =
            varietyFinder(item.variety, product);
          setDetails((prev) => {
            const orders = prev;
            orders.push({
              product,
              count: item.count,
              color,
              priceBefore: priceBefforDiscount,
              priceAfter: mainPrice,
              name: specification,
            });
            return orders;
          });
        })
      );
      setLoading(false);
    },
    onError: () => {
      setLoading(false);
      setError('سفارش مورد نظر یافت نشد.');
      toast.warn('خطایی رخ داده است');
    },
  });
  useEffect(() => {
    getOrderHistoryFn.mutateAsync();
  }, [user, user?.order_history.documentId]);

  if (error)
    return (
      <div>
        <h1>{error}</h1>
      </div>
    );
  if (loading) {
    return (
      <div>
        <LoadingAnimation />
        <h6>در حال بارگذاری...</h6>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {orderData ? (
        <div className="flex flex-col w-full">
          <h2 className="self-center">جزئیات سفارش</h2>
          <div className="border">
            <div className="flex flex-col border-b lg:flex-row justify-between">
              <div className="flex flex-col p-2 border-b lg:border-b-0 lg:border-l w-full h-full">
                <p className="flex items-center gap-2">
                  <IoQrCode className="text-foreground/75" />
                  <span className="text-foreground/75">کد سفارش: </span>
                  <span>{orderData.orderCode}</span>
                </p>
                <p className="flex items-center gap-2">
                  <LuCalendarClock className="text-foreground/75" />
                  <span className="text-foreground/75">تاریخ سفارش:</span>
                  <span>
                    {new Date(orderData.orderDate).toLocaleDateString('fa-IR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <FaUserTag className="text-foreground/75" />
                  <span className="text-foreground/75">نام گیرنده: </span>
                  <span>
                    {orderData.firstName} {orderData.lastName}
                  </span>
                </p>
              </div>
              <div className="flex flex-col w-full h-full p-2">
                <Toman>
                  <CiMoneyBill className="text-foreground/75" />
                  <p className="text-foreground/75">مبلغ: </p>
                  <p>{(orderData.orderPrice / 10).toLocaleString('fa-IR')}</p>
                </Toman>
                <div className="flex items-center gap-1">
                  <FaShippingFast className="text-foreground/75" />
                  <p className="text-foreground/75">هزینه ارسال: </p>
                  {orderData.shippingMethod == 'تیپاکس | تیپاکس' ? (
                    <p>پس کرایه</p>
                  ) : (
                    <Toman>
                      <p>
                        {(orderData.shippingPrice / 10).toLocaleString('fa-IR')}
                      </p>
                    </Toman>
                  )}
                </div>
                <Toman>
                  <FaRegMoneyBillAlt className="text-foreground/75" />
                  <p className="text-foreground/75">مجموع: </p>
                  <p>{(orderData.totalPrice / 10).toLocaleString('fa-IR')}</p>
                </Toman>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row justify-between">
              <div className="flex flex-col p-2 border-b lg:border-b-0 lg:border-l w-full h-full">
                <p className="flex items-center gap-2">
                  <FaBuildingUser className="text-foreground/75" />
                  <span className="text-foreground/75">
                    نشانی تحویل گیرنده:{' '}
                  </span>
                </p>
                <div className="flex flex-wrap gap-2">
                  <p>
                    <span className="text-foreground/75">استان: </span>{' '}
                    <span>{orderData.province}</span>
                  </p>
                  <p>
                    <span className="text-foreground/75">شهرستان: </span>{' '}
                    <span>{orderData.city}</span>
                  </p>{' '}
                </div>
                <div className="flex flex-wrap gap-2">
                  <p>
                    <span className="text-foreground/75">تلفن همراه: </span>{' '}
                    <span>{orderData.mobileNumber}</span>
                  </p>
                  <p>
                    <span className="text-foreground/75">تلفن: </span>{' '}
                    <span>{orderData.phoneNumber}</span>
                  </p>
                </div>
                <p>
                  <span className="text-foreground/75">نشانی: </span>{' '}
                  <span>{orderData.address}</span>
                </p>
                <p>
                  <span className="text-foreground/75">کدپستی: </span>{' '}
                  <span>{orderData.postCode}</span>
                </p>
              </div>
              <div className="flex flex-col w-full h-full p-2">
                <p className="flex items-center gap-2">
                  <FaMoneyCheck className="text-foreground/75" />
                  <span className="text-foreground/75">روش پرداخت: </span>{' '}
                  <span>
                    {orderData.payMethod == 'online'
                      ? 'درگاه پرداخت'
                      : orderData.payMethod == 'offline'
                        ? 'کارت به کارت'
                        : 'اسنپ پی'}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <GrStatusGood className="text-foreground/75" />
                  <span className="text-foreground/75">وضعیت پرداخت: </span>
                  <span>
                    {orderData.paymentStatus == 'completed'
                      ? 'پرداخت شده'
                      : orderData.paymentStatus == 'pending'
                        ? 'در انتظار پرداخت'
                        : 'لغو شده'}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <LiaShippingFastSolid className="text-foreground/75" />
                  <span className="text-foreground/75">روش ارسال: </span>
                  <span>{orderData.shippingMethod}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col p-2 lg:p-5 gap-2 mt-2">
            {details.length > 0 &&
              details.map((item, index) => {
                return (
                  <div
                    className="w-full flex flex-col lg:flex-row p-2 gap-2 border rounded-lg justify-center lg:justify-start items-center lg:items-start"
                    key={index}
                  >
                    <Link
                      href={`/shop/product/${item.product.basicInfo.contentCode}`}
                    >
                      <Image
                        src={
                          item.product.basicInfo.mainImage.formats.thumbnail.url
                        }
                        alt={item.product.basicInfo.title}
                        width={
                          item.product.basicInfo.mainImage.formats.thumbnail
                            .width
                        }
                        height={
                          item.product.basicInfo.mainImage.formats.thumbnail
                            .height
                        }
                        quality={75}
                        className="rounded-lg hover:opacity-75 transition-opacity"
                      />
                    </Link>
                    <div className="flex flex-col w-full items-center lg:items-start">
                      <Link
                        className="flex flex-col lg:flex-row w-full lg:border-b border-gray-100 justify-between"
                        href={`/shop/product/${item.product.basicInfo.contentCode}`}
                      >
                        <h3 className="text-accent-pink hover:text-accent-pink/75 transition-colors">
                          {item.product.basicInfo.title}
                        </h3>
                        <SubmitButton className="bg-gray-200 text-foreground m-1 py-0 mb-2">
                          مشاهده محصول
                        </SubmitButton>
                      </Link>
                      <div className="w-full max-w-lg flex flex-col lg:flex-row justify-between items-center">
                        <div className="w-fit">
                          <div className="flex gap-2 items-center">
                            <div
                              style={{
                                background:
                                  item.color != '#000000' ? item.color : '',
                              }}
                              className="rounded-full w-4 h-4 border-black border"
                            />
                            <p>{item.name}</p>
                          </div>

                          <p className="flex flex-wrap gap-2">
                            <span className="text-gray-500">تعداد:</span>
                            <span>{item.count}</span>
                          </p>
                        </div>
                        <div className="w-fit">
                          <div className="flex flex-wrap gap-2">
                            <p>
                              <span className="text-gray-500">قیمت واحد: </span>{' '}
                            </p>
                            <Toman className="fill-accent-green gap-2">
                              {item.priceBefore && (
                                <p className="line-through text-gray-500">
                                  {(item.priceBefore / 10).toLocaleString(
                                    'fa-IR'
                                  )}
                                </p>
                              )}
                              <p className="text-accent-green">
                                {(item.priceAfter / 10).toLocaleString('fa-IR')}
                              </p>
                            </Toman>
                          </div>
                          {item.count > 1 && (
                            <div className="flex flex-wrap gap-2">
                              <p>
                                <span className="text-gray-500">مجموع: </span>{' '}
                              </p>
                              <Toman className="fill-accent-green gap-2">
                                {item.priceBefore && (
                                  <p className="line-through text-gray-500">
                                    {(
                                      (item.priceBefore / 10) *
                                      item.count
                                    ).toLocaleString('fa-IR')}
                                  </p>
                                )}
                                <p className="text-accent-green">
                                  {(
                                    (item.priceAfter / 10) *
                                    item.count
                                  ).toLocaleString('fa-IR')}
                                </p>
                              </Toman>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          {/* <p>{JSON.stringify(details)}</p> */}
          {/* Add more order details as needed */}
        </div>
      ) : (
        <p>سفارش مورد نظر یافت نشد.</p>
      )}
    </div>
  );
}
