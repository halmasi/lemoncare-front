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

  return (
    <>
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
              <div className="flex gap-2" key={index}>
                {item.subVariety.length > 0 &&
                  item.subVariety.map((i) => {
                    return (
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
                    );
                  })}
              </div>
            );
          })}
        </>
      </div>
      <button
        onClick={() => {
          console.log('Hello');
        }}
        className="flex w-full md:w-fit items-center gap-2 bg-accent-green px-4 py-2 rounded-lg text-white bottom-0"
      >
        <p>افزودن به سبد خرید</p>
        <BiShoppingBag />
      </button>
    </>
  );
}
