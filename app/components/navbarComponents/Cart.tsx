'use client';

import { getProduct, ProductProps } from '@/app/utils/data/getProducts';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { RiShoppingCart2Fill } from 'react-icons/ri';
import Table from '../Table';
import Image from 'next/image';

export default function Cart() {
  const { user } = useDataStore();

  const [showItems, setShowItems] = useState(false);
  const [products, setProducts] = useState<
    {
      product: ProductProps;
      count: number;
    }[]
  >([]);

  const [tableItems, setTableItems] = useState();

  useEffect(() => {
    if (user && user.cart) {
      const productsId = user?.cart.map((item) => {
        return {
          documentId: item.product.documentId,
          count: item.count,
        };
      });
      productsId.forEach(async (item) => {
        const product = await getProduct(item.documentId);
        if (product) {
          let duplicateCheck = true;
          products.map((item) => {
            if (item.product.documentId == product[0].documentId) {
              duplicateCheck = false;
            }
          });
          if (duplicateCheck) {
            setProducts((prev) => {
              const productList = prev;
              productList.push({ product: product[0], count: item.count });
              return productList;
            });
          }
        }
      });
    }
  }, [user]);
  return (
    <>
      <div
        className="flex flex-col justify-end"
        onMouseOver={() => {
          setShowItems(true);
        }}
        onMouseOut={() => {
          setShowItems(false);
        }}
      >
        <div className="rounded-lg border p-2">
          <RiShoppingCart2Fill className="text-2xl" />
        </div>
        <AnimatePresence>
          {showItems && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              style={{}}
              transition={{
                duration: 0.3,
                ease: 'easeOut',
              }}
              className="absolute left-10 top-36 w-fit bg-white rounded-lg border"
            >
              <div className="p-5 w-full  overflow-hidden">
                <Table
                  rowsWidth={[20, 'full', 'full']}
                  rowsHeight={20}
                  headerItems={[<p>تعداد</p>, <p>محصول</p>, <p>تصویر</p>]}
                  rowItems={products.map((item) => {
                    return [
                      <p>{item.count}</p>,
                      <p>{item.product.basicInfo.title}</p>,
                      <div className="w-32 overflow-hidden bg-black">
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
                          className="object-contain aspect-square"
                        />
                      </div>,
                    ];
                  })}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
