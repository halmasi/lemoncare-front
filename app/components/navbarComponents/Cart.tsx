'use client';

import { useCartStore } from '@/app/utils/states/useCartData';
import { ReactNode, useEffect, useState } from 'react';
import Table from '../Table';
import Image from 'next/image';
import Link from 'next/link';
import Count from './Count';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { getCart, updateCart } from '@/app/utils/actions/cartActionMethods';
import { useRouter } from 'next/navigation';
import { getFullUserData } from '@/app/utils/actions/actionMethods';
import Toman from '../Toman';
import { varietyFinder } from '@/app/utils/shopUtils';
import { cartProductSetter } from '@/app/utils/shopUtils';

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
    if (user && jwt && user.shopingCart)
      getCart(user.shopingCart.documentId).then((data) => {
        setCart(data.data.items);
      });
  }, [jwt, user, setCart]);

  useEffect(() => {
    if (user && user.cart && cart.length != user.cart.length) {
      updateCart(cart, user.shopingCart.documentId).then(() => {
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
          cartProductSetter(item, cartProducts).then(async (data) => {
            setCartProducts(data);
          });
        });
      }
      setTableRow([]);
      setTotalBeforePrice(0);
      setTotalPrice(0);
      cart.forEach((cartItem, index) => {
        const product = cartProducts.find(
          (searchProduct) =>
            searchProduct.documentId == cartItem.product.documentId
        );
        if (product) {
          const {
            color,
            inventory,
            mainPrice,
            priceBefforDiscount,
            specification,
          } = varietyFinder(cartItem.variety, product);
          setTotalPrice((prev) => prev + mainPrice * cartItem.count);
          setTotalBeforePrice(
            (prev) => prev + priceBefforDiscount * cartItem.count
          );
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
                  <p>{specification}</p>
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
                  {priceBefforDiscount > 0 && (
                    <p className="line-through text-gray-400 text-xs">
                      {(
                        (priceBefforDiscount * cartItem.count) /
                        10
                      ).toLocaleString('fa-IR')}
                    </p>
                  )}
                  <Toman className="font-bold text-accent-green fill-accent-green">
                    <p>
                      {((mainPrice * cartItem.count) / 10).toLocaleString(
                        'fa-IR'
                      )}
                    </p>
                  </Toman>
                </div>
              </div>,
            ]);
            return copy;
          });
        }
      });
    }
  }, [
    cart,
    setCart,
    cartProducts,
    setCartProducts,
    user,
    setUser,
    route,
    totalPrice,
  ]);

  useEffect(() => {
    if (priceAmount) priceAmount(totalPrice, totalBeforePrice);
  }, [totalBeforePrice, totalPrice, priceAmount]);

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
