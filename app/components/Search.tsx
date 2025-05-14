'use client';
import { useDebouncedCallback } from 'use-debounce';
import InputBox from './formElements/InputBox';
import { useEffect, useRef, useState } from 'react';
import SubmitButton from './formElements/SubmitButton';
import { BiSearchAlt2 } from 'react-icons/bi';
import { useMutation } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { PostsProps } from '../utils/schema/blogProps';
import { ProductProps } from '../utils/schema/shopProps';
import LoadingAnimation from './LoadingAnimation';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function Search() {
  const [param, setParam] = useState<string>('');
  const [showDropDown, setShowDropDown] = useState(false);
  const [postData, setPostData] = useState<PostsProps[]>();
  const [productData, setProductData] = useState<ProductProps[]>();

  const inputRef = useRef<HTMLInputElement>(null);

  const { push } = useRouter();

  const searchFn = useMutation({
    mutationFn: async () => {
      if (inputRef.current) {
        inputRef.current.value = param;
      }
      if (param) {
        const res = await fetch(`/api/search`, {
          method: 'POST',
          body: JSON.stringify({
            param: param,
            page: 1,
            pageSize: 3,
          }),
        });
        const data = await res.json();
        return data[0];
      }
    },
    onSuccess: (data: { posts: PostsProps[]; products: ProductProps[] }) => {
      if (!data) return;
      setPostData(data.posts);
      setProductData(data.products);
    },
  });

  useEffect(() => {
    if (param) {
      searchFn.mutateAsync();
    }
  }, [param]);

  const handleSearch = useDebouncedCallback((term: string) => {
    if (term) {
      setParam(term);
    } else setParam('');
  }, 500);

  return (
    <div
      className="flex flex-col relative items-center justify-center w-full"
      onClick={() => {
        if (inputRef.current?.value) setShowDropDown(true);
        const handleClickOutside = (event: MouseEvent) => {
          if (
            inputRef.current &&
            !inputRef.current.contains(event.target as Node)
          ) {
            setShowDropDown(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }}
    >
      <div className="flex flex-row justify-stretch w-full">
        <div className="w-full">
          <InputBox
            type="text"
            placeholder="جستجو مقاله و محصول"
            onChange={(e) => handleSearch(e.target.value)}
            ref={inputRef}
            name={'search'}
            className="hidden md:flex rounded-l-none border-l-0 focus:ring-0 focus:outline-none"
          />
          <InputBox
            type="text"
            placeholder="جستجو مقاله و محصول"
            ref={inputRef}
            name={'search'}
            className="flex md:hidden rounded-l-none border-l-0 focus:ring-0 focus:outline-none"
          />
        </div>

        <SubmitButton
          className="w-fit bg-white hover:bg-gray-50 border rounded-r-none border-r-0 drop-shadow-none text-foreground/80 hover:text-foreground"
          onClick={() => {
            // redirect
            push(`/search/?s-query=${inputRef.current?.value}&s-page=1`);
          }}
        >
          <BiSearchAlt2 />
        </SubmitButton>
      </div>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={
            showDropDown
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 20, visibility: 'hidden' }
          }
          exit={{ opacity: 0, y: 20, visibility: 'hidden' }}
          style={showDropDown ? {} : {}}
          transition={{
            duration: 0.3,
            ease: 'easeOut',
          }}
          className="hidden md:flex absolute left-0 top-full min-w-[30rem] w-full  bg-white rounded-b-lg shadow-lg"
        >
          <div className="w-full min-h-[16rem] max-h-[50svh]">
            {searchFn.isPending ? (
              <div className="flex flex-col items-center justify-center w-full h-full">
                <h6>درحال جستجو...</h6>
                <LoadingAnimation />
              </div>
            ) : postData?.length || productData?.length ? (
              <div>
                <div>
                  {postData?.map((item) => (
                    <Link
                      href={`/blog/posts/${item.basicInfo.contentCode}`}
                      key={item.id}
                      className="flex flex-row items-center justify-between p-2 border-b border-gray-200"
                    >
                      <p>{item.basicInfo.title}</p>
                      <Image
                        src={item.basicInfo.mainImage.formats.thumbnail.url}
                        alt={item.basicInfo.title}
                        width={item.basicInfo.mainImage.formats.thumbnail.width}
                        height={
                          item.basicInfo.mainImage.formats.thumbnail.height
                        }
                        className="w-32 object-contain rounded-lg"
                      ></Image>
                    </Link>
                  ))}
                </div>
                <div>
                  {productData?.map((item) => (
                    <Link
                      href={`/shop/product/${item.basicInfo.contentCode}`}
                      key={item.id}
                      className="flex flex-row items-center justify-between p-2 border-b border-gray-200"
                    >
                      <p>{item.basicInfo.title}</p>
                      <Image
                        src={item.basicInfo.mainImage.formats.thumbnail.url}
                        alt={item.basicInfo.title}
                        width={item.basicInfo.mainImage.formats.thumbnail.width}
                        height={
                          item.basicInfo.mainImage.formats.thumbnail.height
                        }
                        className="w-32 object-contain rounded-lg"
                      ></Image>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-5 text-center text-gray-500">
                هیچ نتیجه ای پیدا نشد
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
