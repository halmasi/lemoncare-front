'use client';
import { BiShoppingBag } from 'react-icons/bi';
import { ProductProps } from '../utils/data/getProducts';
import RadioButton from './formElements/RadioButton';
import { useEffect, useState } from 'react';
import DiscountTimer from './DiscountTimer';

export default function VarietySelector({
  product,
  list,
}: {
  product: ProductProps;
  list?: boolean;
}) {
  const [selected, setSelected] = useState<{ id: number; sub: number | null }>({
    id: 0,
    sub: null,
  });
  const [available, setAvailable] = useState<boolean>(true);
  const [price, setPrice] = useState<{
    id: number;
    sub: number | null;
    before?: number | null;
    end?: number | null;
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
    const lessPrice: {
      id: number | null;
      sub: number | null;
      price: number;
    } = { id: null, sub: null, price: 0 };
    product.variety.map((item) => {
      if (item.subVariety.length) {
        item.subVariety.map((sub) => {
          if (sub.mainPrice < lessPrice.price || !lessPrice.price) {
            lessPrice.id = item.id;
            lessPrice.sub = sub.id;
            lessPrice.price = sub.mainPrice;
          }
        });
        if (
          (item.mainPrice && item.mainPrice < lessPrice.price) ||
          !lessPrice.price
        ) {
          lessPrice.id = item.id;
          lessPrice.sub = null;
          lessPrice.price = item.mainPrice;
        }
      }
    });
    if (lessPrice.price && lessPrice.id) {
      setSelected({
        id: lessPrice.id,
        sub: lessPrice.sub,
      });
    } else setAvailable(true);
  }, []);

  useEffect(() => {
    const mainIdPrice = product.variety.find(
      (e) => e.id == selected.id
    )?.mainPrice;
    const subIdPrice = product.variety
      .find((e) => e.id == selected.id)
      ?.subVariety.find((s) => s.id == selected.sub)?.mainPrice;
    if (mainIdPrice && selected.sub == null) {
      const endDate =
        new Date(
          product.variety.find((e) => e.id == selected.id)!.endOfDiscount!
        ).getTime() || null;

      setPrice({
        id: selected.id,
        sub: selected.sub,
        before:
          product.variety.find((e) => e.id == selected.id)
            ?.priceBeforeDiscount || null,
        end: endDate || null,
        price: mainIdPrice,
      });
    } else if (selected.sub != null && subIdPrice) {
      const endDate =
        new Date(
          product.variety
            .find((e) => e.id == selected.id)!
            .subVariety.find((s) => s.id == selected.sub)!.endOfDiscount!
        ).getTime() || null;
      setPrice({
        id: selected.id,
        sub: selected.sub,
        before:
          product.variety
            .find((e) => e.id == selected.id)
            ?.subVariety.find((s) => s.id == selected.sub)
            ?.priceBefforDiscount || null,
        end: endDate || null,
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

  return list ? (
    <>
      {price.price ? (
        <div>
          <div className="flex gap-3 pb-2">
            <h6 className="text-accent-green">
              {parseInt(price.price / 10 + '').toLocaleString('fa-IR')} تومان
            </h6>
            {price.before && (
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
            )}
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
          {price.end && <DiscountTimer end={price.end} />}
        </div>
      ) : (
        <div>{!available && <h5 className="text-red-500">ناموجود</h5>}</div>
      )}
    </>
  ) : (
    <>
      <div className="flex flex-col w-full md:w-[80%] min-h-[30svh] m-10 mt-0 p-5 border bg-gray-100 rounded-xl justify-center items-center">
        {price.price ? (
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
            {price.end && <DiscountTimer end={price.end} />}
          </>
        ) : (
          <div>
            {available ? (
              <>
                <p>محصول انتخاب شده ناموجود است،</p>
                <p>گزینه های موجود را انتخاب کنید.</p>
              </>
            ) : (
              <h5 className="text-red-500">ناموجود</h5>
            )}
          </div>
        )}
      </div>
      <div>
        <div className="flex gap-2 p-2">
          {product.variety.map((item, index) => {
            return (
              <RadioButton
                value={{ id: item.id, sub: null }}
                key={index + 'id:' + item.id}
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
                  item.subVariety.map((subItem) => (
                    <RadioButton
                      key={subItem.id}
                      handler={itemSelectFunc}
                      selectedOptions={selected}
                      value={{ id: item.id, sub: subItem.id }}
                      color={subItem.color}
                      group="subItems"
                    >
                      {subItem.specification}
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
