import Content from '@/app/components/Content';
import MainSection from '@/app/components/MainSection';
import VarietySelector from '@/app/components/VarietySelector';
import { getProduct, ProductProps } from '@/app/utils/data/getProducts';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import React from 'react';

export default async function product({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const productArray: ProductProps[] = await getProduct(slug);
  if (!productArray.length) return notFound();
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
            <div>
              <p
                className={
                  product.available ? 'text-accent-green' : 'text-red-700'
                }
              >
                {product.available ? 'موجود' : 'ناموجود'}
              </p>
              <VarietySelector product={product} />
            </div>
          </div>
        </div>
        <div className="mt-5 md:mx-10 bg-slate-50 px-2 border rounded-lg">
          <h3 className="text-accent-pink">توضیحات محصول:</h3>
          <div className=" border md:hidden" />
          {product.detailes.map((item, i) => (
            <Content key={i} props={item} />
          ))}
        </div>
      </div>
    </MainSection>
  );
}
