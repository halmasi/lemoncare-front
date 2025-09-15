'use client';
import { useEffect, useState } from 'react';
import { ProductProps } from '../utils/schema/shopProps';
import Content from './Content';
import { useMutation } from '@tanstack/react-query';
import { getDetailesKey, getDetailesValue } from '../utils/data/getProducts';
import Table from './Table';

export default function ProductDetailes({
  product,
}: {
  product: ProductProps;
}) {
  const [showContent, setShowContent] = useState<boolean>(false);
  const [showDetaileTable, setShowDetaileTable] = useState<boolean>(false);
  const [detaileTable, setDetaileTable] = useState<
    { key: string; value: string }[]
  >([]);

  const getDetailesFn = useMutation({
    mutationFn: async () => {
      const res = Promise.all(
        product.detailesTable.map(async (item) => {
          const key = await getDetailesKey({
            id: item.detaile_key.documentId,
          });
          const value = await getDetailesValue({
            id: item.detaile_value.documentId,
          });

          return { key: key.title, value: value.title };
        })
      );
      return res;
    },
    onSuccess: (data) => {
      setDetaileTable(data);
    },
  });

  useEffect(() => {
    if (product.detailesTable && product.detailesTable.length) {
      getDetailesFn.mutate();
    }
  }, [product]);
  return (
    <>
      <div className="mt-5 md:mx-10 bg-slate-50 border rounded-lg">
        <div className="flex flex-col items p-2">
          <h6 className="text-accent-pink">توضیحات محصول:</h6>
          <div className={`${showContent ? 'h-fit' : 'h-20'} overflow-hidden`}>
            {product.detailes.map((item, i) => (
              <Content key={i} props={item} />
            ))}
          </div>
          {!showContent ? (
            <div className="-mt-5">
              <button
                onClick={() => {
                  setShowContent(true);
                }}
                className="flex justify-center pt-2 bg-gradient-to-t from-slate-50 to-slate-50/0 w-full text-accent-pink"
              >
                <p className="bg-slate-50 border p-1 rounded-lg w-fit">
                  ادامه توضیحات
                </p>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setShowContent(false);
              }}
              className="flex justify-center pt-2 bg-gradient-to-t from-slate-50 to-slate-50/0 w-full text-accent-pink"
            >
              <p className="bg-slate-50 border p-1 rounded-lg w-fit">
                بستن توضیحات
              </p>
            </button>
          )}
        </div>
      </div>
      {detaileTable && detaileTable.length > 0 && (
        <div className="mt-5 md:mx-10 bg-slate-50 border rounded-lg">
          <div className="flex flex-col items p-2">
            <h6 className="text-accent-pink">مشخصات محصول:</h6>
            <div
              className={`${showDetaileTable ? 'h-fit' : 'h-20'} overflow-hidden`}
            >
              <Table
                rowItems={detaileTable.map((item, i) => [
                  <div
                    key={item.key + i}
                    className="w-fit pr-5 text-accent-green text-base"
                  >
                    <p>{item.key}</p>
                  </div>,
                  <div key={item.value + i} className="pl-5">
                    <p>{item.value}</p>
                  </div>,
                ])}
                rowsHeight={'h-14'}
                rowsWidth={[1, 1]}
              />
            </div>
            {!showDetaileTable ? (
              <div className="-mt-5">
                <button
                  onClick={() => {
                    setShowDetaileTable(true);
                  }}
                  className="flex justify-center pt-2 bg-gradient-to-t from-slate-50 to-slate-50/0 w-full text-accent-pink"
                >
                  <p className="bg-slate-50 border p-1 rounded-lg w-fit">
                    ادامه مشخصات
                  </p>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowDetaileTable(false);
                }}
                className="flex justify-center pt-2 bg-gradient-to-t from-slate-50 to-slate-50/0 w-full text-accent-pink"
              >
                <p className="bg-slate-50 border p-1 rounded-lg w-fit">
                  بستن مشخصات
                </p>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
