'use client';

import { PostsProps } from '../utils/data/getPosts';
import { ProductProps } from '../utils/data/getProducts';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar, A11y, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import PostCard from './PostCard';
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';

interface Props {
  posts?: PostsProps[];
  products?: ProductProps[];
  title: string;
  children: ReactNode;
}

export default function Suggestions({
  posts,
  products,
  title,
  children,
}: Props) {
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const [buttonStatus, setButtonStatus] = useState({
    next: false,
    prev: false,
  });

  useEffect(() => {
    setButtonStatus({
      next: !nextBtnRef.current?.disabled,
      prev: !prevBtnRef.current?.disabled,
    });
  }, []);

  const changeSlide = () => {
    setButtonStatus({
      next: !nextBtnRef.current?.disabled,
      prev: !prevBtnRef.current?.disabled,
    });
  };

  return (
    <div>
      <div className="flex gap-2 items-center bg-white p-3 rounded-t-3xl border border-b-0">
        {children}
        <h5>{title}</h5>
      </div>
      <div className="flex items-center justify-between bg-white md:p-5 rounded-2xl border border-t-0 rounded-t-none shadow-xl">
        <div
          className={`transition-opacity text-sm rounded-full ${buttonStatus.prev ? 'opacity-80' : 'opacity-20'}`}
        >
          <button
            ref={prevBtnRef}
            className={`flex ${posts && posts.length ? 'bg-accent-yellow' : 'bg-accent-pink'} text-white slide-prev p-2 rounded-r-full`}
          >
            <BiRightArrow />
          </button>
        </div>

        <Swiper
          style={
            {
              '--swiper-pagination-color': '#fff',
              '--swiper-navigation-color': '#fff',
            } as CSSProperties
          }
          slidesPerView={1}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            480: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 40,
            },
          }}
          spaceBetween={10}
          pagination={{ clickable: true, type: 'bullets' }}
          navigation={{
            enabled: true,
            nextEl: '.slide-next',
            prevEl: '.slide-prev',
          }}
          onSlideChange={changeSlide}
          modules={[Navigation, Scrollbar, A11y, FreeMode]}
          className="mySwiper drop-shadow-xl"
        >
          <div className="overflow-visible">
            {posts &&
              posts.map((item) => {
                return (
                  <SwiperSlide
                    className="flex justify-center items-center"
                    key={item.documentId}
                  >
                    <PostCard
                      basicInfo={item.basicInfo}
                      category={item.category}
                      seo={item.seo}
                    />
                  </SwiperSlide>
                );
              })}
            {products &&
              products.map((item) => {
                return (
                  <SwiperSlide
                    className="flex justify-center items-center"
                    key={item.documentId}
                  >
                    <Image
                      src={item.basicInfo.mainImage.url}
                      alt={
                        item.basicInfo.mainImage.alternativeText ||
                        item.basicInfo.mainImage.name
                      }
                      width={item.basicInfo.mainImage.width}
                      height={item.basicInfo.mainImage.height}
                    />
                    {item.basicInfo.title}
                  </SwiperSlide>
                );
              })}
          </div>
        </Swiper>
        <div
          className={`text-sm rounded-full ml-5 ${buttonStatus.next ? 'opacity-80' : 'opacity-20'}`}
        >
          <button
            ref={nextBtnRef}
            className={`flex ${posts && posts.length ? 'bg-accent-yellow' : 'bg-accent-pink'} text-white slide-next p-2 rounded-l-full`}
          >
            <BiLeftArrow />
          </button>
        </div>
      </div>
    </div>
  );
}
