'use client';

import { getProduct, ProductProps } from '@/app/utils/data/getProducts';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { ReactNode, useEffect, useState } from 'react';

import Table from '../Table';
import Image from 'next/image';
import Link from 'next/link';
import Count from './Count';

export default function Cart({
  countFunc,
}: {
  countFunc?: (count: number) => void;
}) {
  const { user } = useDataStore();

  const [tableRow, setTableRow] = useState<ReactNode[][]>([]);
  const [products, setProducts] = useState<
    {
      product: ProductProps;
      variety: { id: number; sub: number | null };
      count: number;
    }[]
  >([]);

  useEffect(() => {
    if (user && user.cart) {
      const productsId = user?.cart.map((item) => {
        return {
          documentId: item.product.documentId,
          variety: item.variety,
          count: item.count,
        };
      });

      productsId.forEach(async (item) => {
        let duplicate = -1;
        productsId.forEach((check) => {
          if (
            item.variety.id == check.variety.id &&
            item.variety.sub == check.variety.sub &&
            item.documentId == check.documentId
          ) {
            if (duplicate >= 0) {
              productsId.splice(productsId.indexOf(item), 1);
              return;
            }
            duplicate++;
          }
        });
        if (!duplicate) {
          const singleProduct = await getProduct(
            item.documentId,
            [],
            ['shopping-cart' + item.documentId]
          );
          setProducts((prevs) => {
            const prev = prevs;
            prev.push({
              product: singleProduct[0],
              variety: item.variety,
              count: item.count,
            });
            return prev;
          });
        }
      });
    }
  }, [user]);

  useEffect(() => {
    setTableRow(() => {
      const prod = products.map((item, index) => {
        return [
          <Count key={index} count={item.count} product={item.product} />,
          <Link
            key={index}
            className="w-full"
            href={`/shop/product/${item.product.basicInfo.contentCode}`}
          >
            <p className="font-bold">{item.product.basicInfo.title}</p>
            {item.product.variety.map((varieties) => {
              let name;
              let color;
              if (item.variety.id == varieties.uniqueId)
                if (!item.variety.sub) {
                  name = varieties.specification;
                  color = varieties.color;
                } else {
                  varieties.subVariety.forEach((sub) => {
                    if (sub.uniqueId == item.variety.sub) {
                      name =
                        varieties.specification + ' | ' + sub.specification;
                      color =
                        sub.color != '#000000' ? sub.color : varieties.color;
                    }
                  });
                }
              color = color == '#000000' ? '' : color;
              return (
                <div className="flex items-center gap-1" key={varieties.id}>
                  <div
                    style={{ background: color }}
                    className={`w-2 h-2 rounded-full`}
                  />
                  <p>{name}</p>
                </div>
              );
            })}
          </Link>,
          <Link
            key={index}
            href={`/shop/product/${item.product.basicInfo.contentCode}`}
            className="w-32 overflow-hidden rounded-lg m-1"
          >
            <Image
              src={item.product.basicInfo.mainImage.formats.thumbnail.url}
              alt=""
              width={item.product.basicInfo.mainImage.formats.thumbnail.width}
              height={item.product.basicInfo.mainImage.formats.thumbnail.height}
              className="object-cover w-full"
            />
          </Link>,
        ];
      });
      return prod;
    });

    if (countFunc) {
      countFunc(products.length);
    }
  }, [products.length, countFunc]);

  return (
    <div className="w-full">
      {user?.cart?.length ? (
        <Table
          rowsWidth={['full', 'full', 'full']}
          rowsHeight={20}
          headerItems={[
            <p key={1}>تعداد</p>,
            <p key={2}>محصول</p>,
            <p key={3}>تصویر</p>,
          ]}
          rowItems={tableRow}
        />
      ) : (
        <div>
          <p>سبد خرید خالی است</p>
        </div>
      )}
    </div>
  );
}
