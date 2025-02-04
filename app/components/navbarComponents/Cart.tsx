'use client';

import { useDataStore } from '@/app/utils/states/useUserdata';
import { ReactNode, useEffect, useState } from 'react';

import Table from '../Table';
import Image from 'next/image';
import Link from 'next/link';
import Count from './Count';
import { getProduct } from '@/app/utils/data/getProducts';

export default function Cart({
  countFunc,
}: {
  countFunc?: (count: number) => void;
}) {
  const { cart, cartProducts, setCartProducts } = useDataStore();

  const [tableRow, setTableRow] = useState<ReactNode[][]>([]);

  useEffect(() => {
    (async () => {
      const productsIdList: string[] = [];
      cart.forEach((productItem) => {
        const product = cartProducts.find(
          (searchProduct) =>
            searchProduct.documentId == productItem.product.documentId
        );
        if (!product) {
          const check = productsIdList.find(
            (id) => id == productItem.product.documentId
          );
          if (!check) {
            productsIdList.push(productItem.product.documentId);
          }
        }
      });
      if (productsIdList.length) {
        productsIdList.forEach(async (item) => {
          const getProductArray = await getProduct(item, [{}]);
          const copy = cartProducts;
          copy.push({
            basicInfo: getProductArray[0].basicInfo,
            documentId: getProductArray[0].documentId,
            variety: getProductArray[0].variety,
          });
          setCartProducts(copy);
        });
      }
      cart.forEach((cartItem, index) => {
        let name = '';
        let color = '';
        let inventory = 0;
        const product = cartProducts.find(
          (searchProduct) =>
            searchProduct.documentId == cartItem.product.documentId
        );
        if (product) {
          product.variety.map((varieties) => {
            if (cartItem.variety.id == varieties.uniqueId)
              if (!cartItem.variety.sub) {
                name = varieties.specification;
                color = varieties.color;
                inventory = varieties.inventory;
              } else {
                varieties.subVariety.forEach((sub) => {
                  if (sub.uniqueId == cartItem.variety.sub) {
                    name = varieties.specification + ' | ' + sub.specification;
                    color =
                      sub.color != '#000000' ? sub.color : varieties.color;
                    inventory = sub.inventory;
                  }
                });
              }
            color = color == '#000000' ? '' : color;
          });
          setTableRow((prev) => {
            const copy = prev;
            copy.push([
              <Count
                key={index}
                count={cartItem.count}
                inventory={inventory}
              />,
              <Link
                key={index}
                className="w-full"
                href={`/shop/product/${product.basicInfo.contentCode}`}
              >
                <p className="font-bold">{product.basicInfo.title}</p>
                <div className="flex items-center gap-1">
                  <div
                    style={{ background: color }}
                    className={`w-2 h-2 rounded-full`}
                  />
                  <p>{name}</p>
                </div>
              </Link>,
              <Link
                key={index}
                href={`/shop/product/${product.basicInfo.contentCode}`}
                className="w-32 overflow-hidden rounded-lg m-1"
              >
                <Image
                  src={product.basicInfo.mainImage.formats.thumbnail.url}
                  alt=""
                  width={product.basicInfo.mainImage.formats.thumbnail.width}
                  height={product.basicInfo.mainImage.formats.thumbnail.height}
                  className="object-cover w-full"
                />
              </Link>,
            ]);
            return copy;
          });
        }
      });
    })();

    if (countFunc) {
      countFunc(cart.length);
    }
  }, [cart.length, cart, cartProducts]);

  return (
    <div className="w-full">
      {cart?.length ? (
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
