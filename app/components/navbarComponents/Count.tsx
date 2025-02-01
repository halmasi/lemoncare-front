import { ProductProps } from '@/app/utils/data/getProducts';
import { useState } from 'react';
import { BiMinus, BiPlus } from 'react-icons/bi';

export default function Count({
  // product,
  count,
}: {
  product: ProductProps;
  count: number;
}) {
  const [number] = useState(count);
  return (
    <div className="flex gap-1 items-center px-5">
      <button className="p-1 border rounded-full">
        <BiPlus className="text-lg text-accent-green" />
      </button>
      <p>{number}</p>
      <button className="p-1 border rounded-full">
        <BiMinus className="text-lg text-accent-pink" />
      </button>
    </div>
  );
}
