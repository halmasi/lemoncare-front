'use client';

import { useCartStore } from '@/app/utils/states/useCartData';
import { ReactNode, useEffect, useState } from 'react';
import Table from '../Table';
import Image from 'next/image';
import Link from 'next/link';
import Count from './Count';
import { getProduct } from '@/app/utils/data/getProducts';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { updateCart } from '@/app/utils/actions/cartActionMethods';
import { useRouter } from 'next/navigation';
import { getFullUserData } from '@/app/utils/actions/actionMethods';

export default function Cart({
  priceAmount,
}: {
  priceAmount?: (main: number, before: number) => void;
}) {
  const { cart, setCart, cartProducts, setCartProducts } = useCartStore();
  const { user, jwt, setUser } = useDataStore();

  const route = useRouter();

  const [tableRow, setTableRow] = useState<ReactNode[][]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalBeforePrice, setTotalBeforePrice] = useState<number>(0);
  const [showCart, setShowCart] = useState<boolean>(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (cart && cart.length) {
      setCount(cart.length);
    } else setCount(0);
  }, [cart]);

  useEffect(() => {
    if (user && jwt)
      getFullUserData().then((data) => {
        setUser(data.body);
        setCart(data.body.cart);
      });
  }, []);

  useEffect(() => {
    if (user && user.cart && cart.length != user.cart.length) {
      updateCart(cart).then(() => {
        getFullUserData().then((data) => {
          setUser(data.body);
          route.refresh();
        });
      });
    }
    if (!cart || !cart.length) {
      setShowCart(false);
    } else {
      setShowCart(true);
      const productsIdList: string[] = [];
      cart.forEach((productItem) => {
        if (productItem && productItem.product) {
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
      setTableRow([]);
      setTotalBeforePrice(0);
      setTotalPrice(0);
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
                    name = varieties.specification + ' | ' + sub.specification;
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
                    className={`w-4 h-4 rounded-full border border-foreground`}
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
            copy.push([
              <div
                key={index}
                className="flex justify-between w-full h-full bg-accent-yellow/10 px-5 items-center border-b-2"
              >
                <div className="w-full h-full">
                  <Count
                    key={index}
                    cartItem={cartItem}
                    inventory={inventory}
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
    }
  }, [cart, setCart, cartProducts, route, totalPrice]);

  useEffect(() => {
    if (priceAmount) priceAmount(totalPrice, totalBeforePrice);
  }, [totalBeforePrice, totalPrice]);

  return (
    <div className="w-full">
      {showCart ? (
        <Table
          key={count}
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
