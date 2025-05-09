'use client';
import { useRef, useState, CSSProperties, useEffect } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper';
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Keyboard,
  FreeMode,
  Thumbs,
} from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

import { BsPlayCircle } from 'react-icons/bs';
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import { MediaProps } from '@/app/utils/schema/mediaProps';

export default function MediaGallery({ media }: { media: MediaProps[] }) {
  const vidRef = useRef<HTMLVideoElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const [buttonStatus, setButtonStatus] = useState({
    next: false,
    prev: false,
  });
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

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
    <>
      <section className="flex flex-col container">
        <div className="flex-col object-cover bg-foreground rounded-xl overflow-hidden container">
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
            thumbs={{ swiper: thumbsSwiper }}
            onSlideChange={() => changeSlide()}
            modules={[
              Keyboard,
              Pagination,
              Navigation,
              Scrollbar,
              A11y,
              FreeMode,
              Thumbs,
            ]}
            className="mySwiper flex"
          >
            <div className="flex z-20 w-full absolute -mt-[30%] mr-3 justify-between">
              <div
                className={`transition-opacity text-sm rounded-full bg-background  ${buttonStatus.prev ? 'opacity-70 hover:opacity-80' : 'opacity-20'}`}
              >
                <button
                  ref={prevBtnRef}
                  className={`flex slide-prev p-2 rounded-full`}
                >
                  <BiRightArrow />
                </button>
              </div>
              <div
                className={`text-sm rounded-full ml-5 bg-background transition-opacity ${buttonStatus.next ? 'opacity-70 hover:opacity-80' : 'opacity-20'}`}
              >
                <button
                  ref={nextBtnRef}
                  className="flex slide-next p-2 rounded-full"
                >
                  <BiLeftArrow />
                </button>
              </div>
            </div>
            {media.map((image, index) => (
              <SwiperSlide
                key={image.id}
                className="flex justify-center items-center"
              >
                <p className="text-sm absolute p-2 rounded-full bg-background/75 m-2">
                  {index + 1} از {media.length}
                </p>
                {image.width && image.height ? (
                  <Image
                    src={image.url}
                    alt={image.alternativeText || image.name}
                    width={image.width}
                    height={image.height}
                    priority
                    className="object-cover block aspect-video"
                  />
                ) : (
                  <video className="aspect-video w-full" ref={vidRef} controls>
                    <source src={image.url} type="video/mp4" />
                  </video>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="bg-gray-100 h-fit rounded-xl p-2 m-2 max-h-24">
          <Swiper
            style={
              {
                '--swiper-pagination-color': '#fff',
                '--swiper-navigation-color': '#fff',
              } as CSSProperties
            }
            onSwiper={setThumbsSwiper}
            spaceBetween={12}
            slidesPerView={4}
            freeMode={true}
            watchSlidesProgress={true}
            navigation={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="thumbs w-full"
          >
            {media.map((image) => (
              <SwiperSlide
                key={image.id}
                className="flex justify-center items-center"
              >
                {image.width && image.height ? (
                  <Image
                    src={image.url}
                    alt={image.alternativeText || image.name}
                    width={image.width}
                    height={image.height}
                    priority
                    className="object-cover block aspect-video"
                  />
                ) : (
                  <div className="w-full flex items-center justify-center aspect-video bg-black">
                    <BsPlayCircle className="text-white text-4xl" />
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </>
  );
}
