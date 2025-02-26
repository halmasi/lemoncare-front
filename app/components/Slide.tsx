'use client';

import { CSSProperties, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

//swiper
import { Swiper, SwiperSlide } from 'swiper/react';

import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';

import { Navigation, Pagination, Keyboard, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { MediaProps } from '../utils/schema/mediaProps';

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
    <div className="flex h-fit container w-full p-2 gap-2">
      <div className="flex items-end">
        <div className="flex absolute m-5 z-20 gap-2">
          <div
            className={`text-sm rounded-full bg-background ${buttonStatus.prev ? 'opacity-80 hover:bg-gray-200' : 'opacity-20'}  transition-all`}
          >
            <button
              ref={prevBtnRef}
              className={`flex slide-prev p-2 rounded-full`}
            >
              <BiRightArrow />
            </button>
          </div>
          <div
            className={`text-sm rounded-full  bg-background ${buttonStatus.next ? 'opacity-80 hover:bg-gray-200' : 'opacity-20'} transition-all`}
          >
            <button
              ref={nextBtnRef}
              className="flex slide-next p-2 rounded-full"
            >
              <BiLeftArrow />
            </button>
          </div>
        </div>
      </div>
      <Swiper
        style={
          {
            '--swiper-pagination-color': '#fff',
            // '-webkit-backface-visibility': 'hidden',
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
        autoplay={{
          pauseOnMouseEnter: true,
          delay: 5000,
        }}
        // scrollbar={{ draggable: true }}
        loop
        onSlideChange={() => changeSlide()}
        modules={[Autoplay, Keyboard, Pagination, Navigation]}
        className="mySwiper w-[90vw] self-center flex items-center justify-center rounded-xl overflow-hidden"
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
                    priority
                    className="w-full md:max-h-[50svh] aspect-video object-cover rounded-xl"
                  />
                )}
              </Link>
            </SwiperSlide>
          ))}
        </div>
      </Swiper>
    </div>
  );
}
