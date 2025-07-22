'use client';

import { CSSProperties, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Swiper, SwiperSlide } from 'swiper/react';

import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';

import { Navigation, Pagination, Keyboard, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { MediaProps } from '@/app/utils/schema/mediaProps';
import { useMutation } from '@tanstack/react-query';
import { SlideProps } from '../utils/schema/otherProps';
import { getSlides } from '../utils/data/getSuggestions';

export default function Slide({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const vidRef = useRef<HTMLVideoElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const prevBtnRef = useRef<HTMLButtonElement>(null);

  const [buttonStatus, setButtonStatus] = useState({
    next: false,
    prev: false,
  });
  const [media, setMedia] = useState<{ media: MediaProps; link: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getSlideFn = useMutation({
    mutationFn: async () => {
      const getSlide: SlideProps = await getSlides(slug);
      return getSlide;
    },
    onSuccess: (slide) => {
      setIsLoading(false);
      if (!slide) return;
      setMedia(slide.medias);
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  useEffect(() => {
    if (slug) {
      setIsLoading(true);
      getSlideFn.mutate();
    } else setIsLoading(false);

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

  if (isLoading || getSlideFn.isPending)
    return (
      <div
        className={`container h-56 w-full bg-gray-500 animate-pulse rounded-xl p-2 m-2 ${className}`}
      />
    );
  return (
    <div className={`${className}`}>
      <div className={`flex h-fit container w-full p-2 gap-2 ${className}`}>
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
    </div>
  );
}
