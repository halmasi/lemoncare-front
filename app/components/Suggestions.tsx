'use client';

import { PostsProps } from '../utils/data/getPosts';
import { ProductProps } from '../utils/data/getProducts';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar, A11y, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { CSSProperties } from 'react';
import Image from 'next/image';
import PostCard from './PostCard';
import { GrArticle } from 'react-icons/gr';

interface Props {
  posts?: PostsProps[];
  products?: ProductProps[];
  title: string;
}

export default function Suggestions({ posts, products, title }: Props) {
  return (
    <div>
      <div className="flex gap-2 items-center">
        <GrArticle />
        <h5>{title}</h5>
      </div>
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
    </div>
  );
  // if (products) return <></>;
  // return <></>;
}
