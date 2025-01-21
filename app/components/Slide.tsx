'use client';

import { CSSProperties, useEffect, useRef, useState } from 'react';
import { MediaProps } from '../utils/data/getProducts';
import Image from 'next/image';
import Link from 'next/link';

//swiper
import { Swiper, SwiperSlide } from 'swiper/react';

import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';

import {
  Navigation,
  Pagination,
  Keyboard,
  Scrollbar,
  A11y,
  FreeMode,
} from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Slide({
  media,
}: {
  media: { media: MediaProps; link: string }[];
}) {
  const vidRef = useRef<HTMLVideoElement>(null);

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
    if (vidRef.current) vidRef.current.pause();
  };

  return (
    <div className="flex items-center justify-center container w-full p-2">
      <div
        className={`hidden md:flex transition-opacity text-sm rounded-full ${buttonStatus.prev ? 'opacity-80' : 'opacity-20'}`}
      >
        <button
          ref={prevBtnRef}
          className={`flex bg-background slide-prev p-2 rounded-full`}
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
        spaceBetween={10}
        keyboard={{ enabled: true }}
        pagination={{ clickable: true, type: 'bullets' }}
        navigation={{
          enabled: true,
          nextEl: '.slide-next',
          prevEl: '.slide-prev',
        }}
        onSlideChange={() => changeSlide()}
        modules={[Keyboard, Pagination, Navigation, Scrollbar, A11y, FreeMode]}
        className="w-[90vw] self-center flex items-center justify-center"
      >
        <div className="flex justify-center">
          {media.map((item) => (
            <SwiperSlide key={item.media.id}>
              <Link href={item.link}>
                {item.media.height && item.media.width && (
                  <Image
                    src={item.media.url}
                    alt=""
                    height={item.media.height}
                    width={item.media.width}
                    className="w-full md:max-h-[50svh] aspect-video object-cover rounded-xl"
                  />
                )}
              </Link>
            </SwiperSlide>
          ))}
        </div>
      </Swiper>
      <div
        className={`hidden md:flex text-sm rounded-full ml-5 ${buttonStatus.next ? 'opacity-80' : 'opacity-20'}`}
      >
        <button
          ref={nextBtnRef}
          className="flex bg-background slide-next p-2 rounded-full"
        >
          <BiLeftArrow />
        </button>
      </div>
    </div>
  );
}
