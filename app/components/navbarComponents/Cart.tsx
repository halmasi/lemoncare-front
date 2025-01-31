'use client';

import { getProduct, ProductProps } from '@/app/utils/data/getProducts';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { RiShoppingCart2Fill } from 'react-icons/ri';
import Table from '../Table';
import Image from 'next/image';
import Link from 'next/link';
import Count from './Count';

export default function Cart() {
  const { user } = useDataStore();

  const [showItems, setShowItems] = useState(false);
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
          const singleProduct = await getProduct(item.documentId);
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
  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="flex flex-col justify-end"
        onMouseOver={() => {
          setShowItems(true);
        }}
        onMouseOut={() => {
          setShowItems(false);
        }}
      >
        <div className="flex flex-col rounded-lg border p-2 h-fit justify-start">
          {products.length > 0 && (
            <div className="flex items-center justify-start">
              <div className="absolute z-0 w-6 h-6 bg-accent-pink rounded-full p-[0.2rem] -mt-4 -mr-4" />
              <div className="absolute text-white -mt-3 -mr-3">
                <p className="z-10 text-xs font-bold px-1">{products.length}</p>
              </div>
            </div>
          )}
          <RiShoppingCart2Fill className="text-2xl" />
        </div>
        <AnimatePresence>
          {showItems && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              style={{}}
              transition={{
                duration: 0.3,
                ease: 'easeOut',
              }}
              className="absolute left-20 top-44 w-[50%] min-[1024px]:w-[35%] bg-white rounded-lg border"
            >
              <div className="p-5 w-full h-[50svh] overflow-y-scroll">
                {products.length > 0 && (
                  <Table
                    rowsWidth={['full', 'full', 'full']}
                    rowsHeight={20}
                    headerItems={[<p>تعداد</p>, <p>محصول</p>, <p>تصویر</p>]}
                    rowItems={products.map((item) => {
                      return [
                        <Count count={item.count} product={item.product} />,
                        <Link
                          className="w-full"
                          href={`/shop/product/${item.product.basicInfo.contentCode}`}
                        >
                          <p className="font-bold">
                            {item.product.basicInfo.title}
                          </p>
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
                                      varieties.specification +
                                      ' | ' +
                                      sub.specification;
                                    color =
                                      sub.color != '#000000'
                                        ? sub.color
                                        : varieties.color;
                                  }
                                });
                              }
                            color = color == '#000000' ? '' : color;
                            return (
                              <div
                                className="flex items-center gap-1"
                                key={varieties.id}
                              >
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
                          href={`/shop/product/${item.product.basicInfo.contentCode}`}
                          className="w-32 overflow-hidden rounded-lg m-1"
                        >
                          <Image
                            src={
                              item.product.basicInfo.mainImage.formats.thumbnail
                                .url
                            }
                            alt=""
                            width={
                              item.product.basicInfo.mainImage.formats.thumbnail
                                .width
                            }
                            height={
                              item.product.basicInfo.mainImage.formats.thumbnail
                                .height
                            }
                            className="object-contain w-full"
                          />
                        </Link>,
                      ];
                    })}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
