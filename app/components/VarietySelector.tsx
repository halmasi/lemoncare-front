'use client';
import { BiShoppingBag } from 'react-icons/bi';
import { ProductProps } from '../utils/data/getProducts';
import RadioButton from './formElements/RadioButton';

export default function VarietySelector({
  product,
}: {
  product: ProductProps;
}) {
  return (
    <>
      <div className="flex gap-2 p-2">
        {product.variety.map((i, index) => {
          return (
            <RadioButton key={index} group="colors" color={i.color}>
              {i.specification}
            </RadioButton>
          );
        })}
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
