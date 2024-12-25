import Content from '@/components/Content';
import MainSection from '@/components/MainSection';
import { getProduct, ProductProps } from '@/utils/data/getProducts';
import Image from 'next/image';
import React from 'react';
import { BiShoppingBag } from 'react-icons/bi';

export default async function product({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const productArray: ProductProps[] = await getProduct(slug);
  const product = productArray[0];
  return (
    <MainSection>
      <div className="w-full flex flex-col">
        <div className="h-fit flex flex-col md:flex-row px-2">
          <div className="w-full md:w-1/2 text-center">
            <h2>{product.basicInfo.title}</h2>
            <Image
              src={product.basicInfo.mainImage.url}
              width={product.basicInfo.mainImage.width}
              height={product.basicInfo.mainImage.height}
              alt={
                product.basicInfo.mainImage.alternativeText ||
                product.basicInfo.title
              }
            />
          </div>
          <div className="flex flex-col w-full md:w-1/2 items-center justify-end">
            <button className="flex w-full md:w-fit items-center gap-2 bg-green-600 px-4 py-2 rounded-lg text-white bottom-0">
              <p>افزودن به سبد خرید</p>
              <BiShoppingBag />
            </button>
          </div>
        </div>
        <div className="mt-5 md:mx-10 bg-slate-50 px-2 border rounded-lg">
          <h3>توضیحات محصول:</h3>
          <div className=" border md:hidden" />
          {product.detailes.map((item, i) => (
            <Content key={i} props={item} />
          ))}
        </div>
      </div>
    </MainSection>
  );
}
