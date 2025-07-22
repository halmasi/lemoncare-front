'use client';

import SubmitButton from '@/app/components/formElements/SubmitButton';
import LoadingAnimation from '@/app/components/LoadingAnimation';
import OrderHistoryCard from '@/app/components/profile/OrderHistoryCard';
import { getFullUserData } from '@/app/utils/actions/actionMethods';
import { getFavorites, getOrderHistory } from '@/app/utils/data/getUserInfo';
import { AddressProps, OrderHistoryProps } from '@/app/utils/schema/userProps';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { getPostalInformation } from '@/app/utils/data/getUserInfo';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { CSSProperties, useEffect, useRef, useState } from 'react';
import { IoIosArrowBack, IoIosBarcode } from 'react-icons/io';
import { TbShoppingBagX } from 'react-icons/tb';
import { toast } from 'react-toastify';
import { BiLeftArrow, BiMap, BiRightArrow } from 'react-icons/bi';
import { MdOutlinePhoneEnabled } from 'react-icons/md';
import { GrMapLocation } from 'react-icons/gr';
import Title from '@/app/components/Title';
import { FaRegHeart } from 'react-icons/fa';
import { ProductProps } from '@/app/utils/schema/shopProps';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  Navigation,
  Scrollbar,
  A11y,
  FreeMode,
  Keyboard,
} from 'swiper/modules';
import ProductCart from '@/app/components/ProductCart';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Dashboard() {
  const { user, setUser, jwt } = useDataStore();
  const [lastOrder, setLastOrder] = useState<OrderHistoryProps[]>();
  const [defualtAddress, setDefualtAddress] = useState<AddressProps>();
  const [favorites, setFavorites] = useState<ProductProps[]>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const prevBtnRef = useRef<HTMLButtonElement>(null);

  const getUserDataFn = useMutation({
    mutationFn: async () => {
      const res = await getFullUserData();
      return res.body;
    },
    onSuccess: async (data) => {
      if (!data) return;
      setUser(data);
    },
    onError: (error: { message: string[] }) => {
      toast.error('Error:' + error.message);
    },
  });

  const getLatestOrderFn = useMutation({
    mutationFn: async () => {
      const order = await getOrderHistory(1, 2);
      return order;
    },
    onSuccess: (data) => {
      if (!data || !data.data) return;
      setLastOrder(data.data);
    },
  });

  const getAddressFn = useMutation({
    mutationFn: async (id: string) => {
      const res: {
        data: {
          id: number;
          documentId: string;
          information: AddressProps[];
        };
      } = await getPostalInformation(id);
      return res.data;
    },
    onSuccess: (data) => {
      if (!data || !data.information || !data.information.length) return;
      const address = data.information.find((item) => item.isDefault == true);
      if (address) setDefualtAddress(address);
    },
  });

  const getFavoritesFn = useMutation({
    mutationFn: async () => {
      if (user && user.favorite.documentId) {
        const favs = await getFavorites(user?.favorite.documentId, 'products');
        return favs.data.products;
      }
    },
    onSuccess: (data) => {
      if (!data) return;
      setFavorites(data);
    },
  });

  useEffect(() => {
    if (!user || !jwt) getUserDataFn.mutate();
  }, [user, jwt]);
  useEffect(() => {
    if (user && !isLoaded) {
      getLatestOrderFn.mutate();
      getAddressFn.mutate(user.postal_information.documentId);
      getFavoritesFn.mutate();
      setIsLoaded(true);
    }
  }, [user]);

  if (!jwt || !user) {
    return (
      <div>
        <h4>در حال بارگزاری ...</h4>
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <div className="flex w-full">
      <div className="flex flex-col gap-5 h-fit w-full">
        <Title>
          <h6 className="text-accent-pink">آخرین سفارشات من</h6>
        </Title>
        {getLatestOrderFn.isPending ? (
          <div className="w-full flex flex-col gap-3 items-center justify-center h-52 bg-gray-400 rounded-lg animate-pulse" />
        ) : lastOrder && lastOrder.length > 0 ? (
          <>
            <Link
              className="hover:text-accent-pink flex items-center gap-2 transition-colors"
              href={'/dashboard/orderhistory'}
            >
              <p>مشاهده لیست سفارش های من </p>
              <IoIosArrowBack className="" />
            </Link>
            {lastOrder.map((item) => (
              <OrderHistoryCard key={item.documentId} item={item} />
            ))}
          </>
        ) : (
          <div className="w-full flex flex-col gap-3 items-center justify-center h-52 bg-gray-300 rounded-lg">
            <p>سفارشی یافت نشد.</p>
            <TbShoppingBagX className="text-xl" />
            <SubmitButton link="/shop">ثبت سفارش جدید</SubmitButton>
          </div>
        )}
        <div className="w-full flex flex-wrap gap-2">
          <div className="w-full flex flex-col gap-2 lg:w-[49%]">
            <Title>
              <h6 className="text-accent-pink">آدرس پیش فرض</h6>
            </Title>
            <Link
              className="hover:text-accent-pink flex items-center gap-2 transition-colors h-10"
              href="/dashboard/addresses"
            >
              <p> ویرایش آدرس ها</p>
              <IoIosArrowBack className="" />
            </Link>
            {getAddressFn.isPending ? (
              <div className="w-full h-52 rounded-lg bg-gray-400 animate-pulse" />
            ) : defualtAddress ? (
              <div className="flex flex-col p-5 rounded-lg border gap-2">
                <div className="flex items-center">
                  <GrMapLocation className="w-10 text-xl" />
                  <div className="flex gap-3">
                    <p>
                      <span className="text-gray-600">استان:</span>{' '}
                      <span>{defualtAddress.province}</span>
                    </p>

                    <p>
                      <span className="text-gray-600">شهر:</span>{' '}
                      <span>{defualtAddress.city}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {/* <div className="w-10 " /> */}
                  <p>
                    <span className="text-gray-600">نشانی:</span>{' '}
                    <span>{defualtAddress.address}</span>
                  </p>
                </div>
                <div className="flex items-center">
                  <IoIosBarcode className="w-10 text-xl" />
                  <p className="gap-2">
                    <span className="text-gray-600">کدپستی:</span>{' '}
                    <span>{defualtAddress.postCode}</span>
                  </p>
                </div>
                <div className="flex items-center">
                  <MdOutlinePhoneEnabled className="w-10 text-xl" />
                  <p className="flex items-center gap-2">
                    <span className="text-gray-600">شماره تماس: </span>{' '}
                    <span>
                      {defualtAddress.phoneNumber} /{' '}
                      {defualtAddress.mobileNumber}
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 w-full h-52 rounded-lg bg-gray-300">
                <p>آدرس پیش فرضی وجود ندارد</p>
                <BiMap />
                <SubmitButton link="/dashboard/addresses">
                  ویرایش آدرس ها
                </SubmitButton>
              </div>
            )}
          </div>
          <div className="w-full flex flex-col gap-2 lg:w-[49%]">
            <Title>
              <h6 className="text-accent-pink">علاقمندی ها</h6>
            </Title>
            <div className="h-10">
              {favorites && favorites.length > 0 && (
                <Link
                  className="hover:text-accent-pink flex items-center gap-2 transition-colors"
                  href={'/dashboard/favorites'}
                >
                  <p>مشاهده لیست علاقمندی ها </p>
                  <IoIosArrowBack className="" />
                </Link>
              )}
            </div>
            {getFavoritesFn.isPending ? (
              <div className="w-full h-52 rounded-lg bg-gray-400 animate-pulse" />
            ) : favorites && favorites.length ? (
              <div className="flex flex-col container">
                <div className="flex items-center object-cover overflow-hidden container">
                  <div className={`transition-opacity text-sm rounded-full`}>
                    <button
                      ref={prevBtnRef}
                      className={`flex transition-colors bg-accent-pink hover:bg-accent-pink/80 text-white slide-prev p-2 rounded-r-full`}
                    >
                      <BiRightArrow />
                    </button>
                  </div>
                  <Swiper
                    style={
                      {
                        '--swiper-pagination-color': '#fff',
                      } as CSSProperties
                    }
                    slidesPerView={1}
                    loop
                    spaceBetween={10}
                    keyboard={{ enabled: true }}
                    navigation={{
                      enabled: true,
                      nextEl: '.slide-next',
                      prevEl: '.slide-prev',
                    }}
                    modules={[Keyboard, Navigation, Scrollbar, A11y, FreeMode]}
                    className="mySwiper flex"
                  >
                    {favorites &&
                      favorites.length > 0 &&
                      favorites.slice(0, 10).map((item, index) => (
                        <SwiperSlide
                          key={index}
                          className="flex justify-center items-center"
                        >
                          <ProductCart showDiscount={false} product={item} />
                        </SwiperSlide>
                      ))}
                  </Swiper>
                  <div className={`text-sm rounded-full ml-5`}>
                    <button
                      ref={nextBtnRef}
                      className={`flex transition-colors bg-accent-pink hover:bg-accent-pink/80 text-white slide-next p-2 rounded-l-full`}
                    >
                      <BiLeftArrow />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 w-full h-52 rounded-lg bg-gray-300">
                <p>لیست علاقمندی ها خالی است</p>
                <FaRegHeart />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
