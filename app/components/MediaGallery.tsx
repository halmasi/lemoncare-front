'use client';
// import { useState } from 'react';
import Image from 'next/image';

import { Swiper, SwiperSlide } from 'swiper/react';
// import { Swiper as SwiperType } from 'swiper';
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Keyboard,
} from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import { MediaProps } from '../utils/data/getProducts';
import { useRef } from 'react';

export default function MediaGallery({ media }: { media: MediaProps[] }) {
  const vidRef = useRef<HTMLVideoElement>(null);
  const handlePlayVideo = () => {
    if (vidRef.current) vidRef.current.pause();
  };
  return (
    <section className="flex container bg-foreground rounded-xl overflow-hidden">
      <div className="flex-col object-cover container">
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          keyboard={{
            enabled: true,
          }}
          pagination={{
            clickable: true,
            type: 'bullets',
          }}
          navigation={true}
          onSlideChange={() => handlePlayVideo()}
          modules={[Keyboard, Pagination, Navigation]}
          className="mySwiper"
        >
          {media.map((image, index) => {
            return (
              <SwiperSlide
                key={image.id}
                className="flex justify-center items-center"
              >
                <p className="absolute p-2 rounded-full bg-background/75 m-2">
                  {index + 1} از {media.length}
                </p>
                {image.width && image.height ? (
                  <Image
                    src={image.url}
                    alt={image.alternativeText || image.name}
                    width={image.width}
                    height={image.height}
                    className="object-cover block aspect-video"
                  />
                ) : (
                  <video ref={vidRef} controls>
                    <source src={image.url} type="video/mp4" />
                  </video>
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
