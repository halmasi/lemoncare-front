'use client';
import { BiShoppingBag } from 'react-icons/bi';
import { ProductProps } from '../utils/data/getProducts';
import RadioButton from './formElements/RadioButton';
import { useEffect, useState } from 'react';

export default function VarietySelector({
  product,
}: {
  product: ProductProps;
}) {
  const [selected, setSelected] = useState<{ id: number; sub: number | null }>({
    id: 0,
    sub: null,
  });
  const [price, setPrice] = useState<{
    id: number;
    sub: number | null;
    before?: number | null;
    end?: string | null;
    price: number | null;
  }>({
    id: selected.id,
    sub: selected.sub,
    price: null,
  });
  const itemSelectFunc = ({ id, sub }: { id: number; sub: number | null }) => {
    setSelected({ id, sub });
  };

  useEffect(() => {
    if (product.variety[0].subVariety.length)
      setSelected({
        id: product.variety[0].id,
        sub: product.variety[0].subVariety[0].id,
      });
    else setSelected({ id: product.variety[0].id, sub: null });
  }, []);

  useEffect(() => {
    const mainIdPrice = product.variety.find(
      (e) => e.id == selected.id
    )?.mainPrice;
    const subIdPrice = product.variety
      .find((e) => e.id == selected.id)
      ?.subVariety.find((s: ProductProps) => s.id == selected.sub)?.mainPrice;
    if (mainIdPrice && selected.sub == null) {
      const endDate =
        new Date(
          product.variety.find((e) => e.id == selected.id)?.endOfDiscount!
        ) || null;
      setPrice({
        id: selected.id,
        sub: selected.sub,
        before:
          product.variety.find((e) => e.id == selected.id)
            ?.priceBeforeDiscount || null,
        end:
          endDate.toLocaleString('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }) || null,
        price: mainIdPrice,
      });
    } else if (selected.sub != null && subIdPrice) {
      const endDate =
        new Date(
          product.variety
            .find((e) => e.id == selected.id)
            .subVariety.find(
              (s: ProductProps) => s.id == selected.sub
            ).endOfDiscount!
        ) || null;
      setPrice({
        id: selected.id,
        sub: selected.sub,
        before:
          product.variety
            .find((e) => e.id == selected.id)
            ?.subVariety.find((s: ProductProps) => s.id == selected.sub)
            ?.priceBefforDiscount || null,
        end:
          endDate.toLocaleString('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }) || null,
        price: subIdPrice,
      });
    } else {
      setPrice({
        id: selected.id,
        sub: null,
        before: null,
        end: null,
        price: null,
      });
    }
  }, [selected]);

  return (
    <>
      <div className="flex flex-col w-full md:w-[80%] min-h-[30svh] m-10 p-5 border bg-gray-100 rounded-xl justify-center items-center">
        {price.price && (
          <>
            <h5>{product.off}</h5>
            <strong>قیمت</strong>
            <div className="flex flex-col items-center gap-1">
              {price.before && (
                <>
                  <p className="flex gap-2 items-center">
                    <span className="text-sm  text-gray-500 line-through">
                      {parseInt(price.before / 10 + '').toLocaleString('fa-IR')}
                    </span>
                    <strong className="p-1 bg-accent-pink rounded-xl text-background">
                      تخفیف{' '}
                      {((1 - price.price / price.before) * 100).toLocaleString(
                        'fa-IR',
                        { style: 'decimal', maximumFractionDigits: 0 }
                      )}{' '}
                      %
                    </strong>
                  </p>
                </>
              )}
            </div>
            <h6 className="text-accent-green">
              {parseInt(price.price / 10 + '').toLocaleString('fa-IR')} تومان
            </h6>
            {price.end && <p>اتمام تخفیف {price.end}</p>}
          </>
        )}
      </div>
      <div>
        <div className="flex gap-2 p-2">
          {product.variety.map((item, index) => {
            return (
              <RadioButton
                value={{ id: item.id, sub: null }}
                key={index}
                group="colors"
                color={item.color}
                handler={itemSelectFunc}
                selectedOptions={selected}
              >
                {item.specification}
              </RadioButton>
            );
          })}
        </div>
        <>
          {product.variety.map((item, index) => {
            return (
              <div className="flex gap-2 p-2" key={index}>
                {item.subVariety.length > 0 &&
                  item.subVariety.map((i) => (
                    <RadioButton
                      key={i.id}
                      handler={itemSelectFunc}
                      selectedOptions={selected}
                      value={{ id: item.id, sub: i.id }}
                      color={i.color}
                      group="subItems"
                    >
                      {i.specification}
                    </RadioButton>
                  ))}
              </div>
            );
          })}
        </>
      </div>
      <button
        onClick={() => {
          console.log(price);
        }}
        className={`flex w-full md:w-fit items-center gap-2 ${!price.price ? 'bg-gray-300' : 'bg-accent-green'} px-4 py-2 rounded-lg text-white bottom-0`}
        disabled={!price.price}
      >
        <p>افزودن به سبد خرید</p>
        <BiShoppingBag />
      </button>
    </>
  );
}
