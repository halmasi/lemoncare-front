'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar, A11y, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import PostCard from './PostCard';
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import VarietySelector from './VarietySelector';
import Link from 'next/link';
import { PostsProps } from '@/app/utils/schema/blogProps';
import { ProductProps } from '@/app/utils/schema/shopProps';

interface Props {
  posts?: PostsProps[];
  products?: ProductProps[];
  title: string;
  id: number;
  children: ReactNode;
}

export default function Suggestions({
  posts,
  products,
  title,
  id,
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
      <div className="w-full flex gap-2 items-center bg-white p-3 rounded-t-3xl border border-b-0">
        {children}
        <h5>{title}</h5>
      </div>
      <div className="flex items-center justify-between bg-white md:p-5 pb-10 rounded-2xl border border-t-0 rounded-t-none shadow-xl">
        <div
          className={`transition-opacity text-sm rounded-full ${buttonStatus.prev ? 'opacity-80' : 'opacity-20'}`}
        >
          <button
            ref={prevBtnRef}
            className={`flex transition-colors ${posts && posts.length ? 'bg-accent-yellow hover:bg-accent-yellow/80' : 'bg-accent-pink hover:bg-accent-pink/80'} text-white ${'slide-prev' + id} p-2 rounded-r-full`}
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
            nextEl: '.slide-next' + id,
            prevEl: '.slide-prev' + id,
          }}
          onSlideChange={changeSlide}
          modules={[Navigation, Scrollbar, A11y, FreeMode]}
          className="mySwiper"
        >
          {posts &&
            posts.length > 0 &&
            posts.map((item) => (
              <SwiperSlide
                key={item.documentId}
                className="flex justify-center items-center"
              >
                <PostCard
                  isSlide
                  basicInfo={item.basicInfo}
                  category={item.category}
                  seo={item.seo}
                />
              </SwiperSlide>
            ))}
          {products &&
            products.length > 0 &&
            products.map((item) => (
              <SwiperSlide
                key={item.documentId}
                className="flex justify-center items-center p-2 border rounded-xl"
              >
                <Link
                  className="space-y-2"
                  href={'/shop/product/' + item.basicInfo.contentCode}
                >
                  <div className="flex flex-row justify-end items-end contain-content">
                    <Image
                      src={item.basicInfo.mainImage.formats.medium.url}
                      alt={
                        item.basicInfo.mainImage.alternativeText ||
                        item.basicInfo.mainImage.formats.medium.name
                      }
                      width={item.basicInfo.mainImage.formats.medium.width}
                      height={item.basicInfo.mainImage.formats.medium.height}
                      className="rounded-lg"
                    />
                    {item.variety.length > 0 && (
                      <div className="absolute flex gap-1 px-3 py-1">
                        {item.variety.map(
                          (variety) =>
                            variety.color && (
                              <div
                                key={variety.id}
                                style={{ background: variety.color }}
                                className="h-3 w-3 rounded-full border-white border-2"
                              />
                            )
                        )}
                      </div>
                    )}
                  </div>

                  <h6>{item.basicInfo.title}</h6>
                </Link>
                <VarietySelector list product={item} />
              </SwiperSlide>
            ))}
        </Swiper>
        <div
          className={`text-sm rounded-full ml-5 ${buttonStatus.next ? 'opacity-80' : 'opacity-20'}`}
        >
          <button
            ref={nextBtnRef}
            className={`flex transition-colors ${posts && posts.length ? 'bg-accent-yellow hover:bg-accent-yellow/80' : 'bg-accent-pink hover:bg-accent-pink/80'} text-white ${'slide-next' + id} p-2 rounded-l-full`}
          >
            <BiLeftArrow />
          </button>
        </div>
      </div>
    </div>
  );
}
