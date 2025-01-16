'use client';

import { PostsProps } from '../utils/data/getPosts';
import { ProductProps } from '../utils/data/getProducts';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar, A11y, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { CSSProperties } from 'react';

interface Props {
  posts?: PostsProps[];
  products?: ProductProps[];
}

export default function Suggestions({ posts, products }: Props) {
  if (posts)
    return (
      <Swiper
        style={
          {
            '--swiper-pagination-color': '#fff',
            '--swiper-navigation-color': '#fff',
          } as CSSProperties
        }
        slidesPerView={4}
        spaceBetween={10}
        pagination={{ clickable: true, type: 'bullets' }}
        navigation={true}
        modules={[Navigation, Scrollbar, A11y, FreeMode]}
        className="mySwiper"
      >
        <div>
          {posts.map((item) => {
            return (
              <SwiperSlide
                className="flex justify-center items-center"
                key={item.documentId}
              >
                {item.basicInfo.title}
              </SwiperSlide>
            );
          })}
        </div>
      </Swiper>
    );
  if (products) return <></>;
  return <></>;
}
