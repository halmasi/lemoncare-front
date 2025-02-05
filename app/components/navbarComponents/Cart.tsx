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
  priceAmount,
}: {
  countFunc?: (count: number) => void;
  priceAmount?: (main: number, before: number) => void;
}) {
  const { cart, setCart, cartProducts, setCartProducts, resetCart } =
    useDataStore();

  const [tableRow, setTableRow] = useState<ReactNode[][]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalBeforePrice, setTotalBeforePrice] = useState<number>(0);
  const [showCart, setShowCart] = useState<boolean>(true);
  useEffect(() => {
    if (cart.length == 0) {
      setShowCart(false);
    } else
      (async () => {
        setShowCart(true);
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
          let priceBefore = 0;
          let priceAfter = 0;

          const product = cartProducts.find(
            (searchProduct) =>
              searchProduct.documentId == cartItem.product.documentId
          );
          if (product) {
            product.variety.forEach((varieties) => {
              if (cartItem.variety.id == varieties.uniqueId)
                if (!cartItem.variety.sub) {
                  name = varieties.specification;
                  color = varieties.color;
                  inventory = varieties.inventory;
                  priceAfter = varieties.mainPrice;
                  priceBefore = varieties.priceBeforeDiscount;
                } else {
                  varieties.subVariety.forEach((sub) => {
                    if (sub.uniqueId == cartItem.variety.sub) {
                      name =
                        varieties.specification + ' | ' + sub.specification;
                      color =
                        sub.color != '#000000' ? sub.color : varieties.color;
                      inventory = sub.inventory;
                      priceAfter = sub.mainPrice;
                      priceBefore = sub.priceBefforDiscount;
                    }
                  });
                }
              color = color == '#000000' ? '' : color;
            });
            setTotalPrice((prev) => prev + priceAfter * cartItem.count);
            setTotalBeforePrice((prev) => prev + priceBefore * cartItem.count);
            setTableRow((prev) => {
              const copy = prev;
              copy.push([
                <Link
                  key={index}
                  className="w-full pr-3"
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
                    height={
                      product.basicInfo.mainImage.formats.thumbnail.height
                    }
                    className="object-cover w-full"
                  />
                </Link>,
              ]);
              copy.push([
                <div
                  key={index}
                  className="flex justify-between w-full h-full bg-accent-yellow/10 px-5 items-center border-b-2"
                >
                  <div className="w-full h-full">
                    <Count
                      key={index}
                      count={cartItem.count}
                      inventory={inventory}
                      changeAmount={(amount: number) => {
                        const newCart = cart;
                        newCart[cart.indexOf(cartItem)].count = amount;
                        setCart(newCart);
                      }}
                    />
                  </div>
                  <div className="flex flex-wrap w-full items-center justify-end gap-2">
                    <h6 className="text-accent-pink text-base">قیمت:</h6>
                    {priceBefore > 0 && (
                      <p className="line-through text-gray-400 text-xs">
                        {((priceBefore * cartItem.count) / 10).toLocaleString(
                          'fa-IR'
                        )}
                      </p>
                    )}
                    <p className="font-bold text-accent-green">
                      {((priceAfter * cartItem.count) / 10).toLocaleString(
                        'fa-IR'
                      )}{' '}
                      <span className="text-xs">تومان</span>
                    </p>
                  </div>
                </div>,
              ]);
              return copy;
            });
          }
        });
      })();

    if (countFunc) {
      countFunc(cart.length);
    }
  }, [cart.length, cart, cartProducts, resetCart]);

  useEffect(() => {
    if (priceAmount) priceAmount(totalPrice, totalBeforePrice);
  }, [totalBeforePrice, totalPrice]);

  return (
    <div className="w-full">
      {showCart ? (
        <Table
          rowsWidth={['full', 'fit']}
          rowsHeight={['20', 'fit']}
          normalColorChange={0}
          highlightColorChange={0}
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
