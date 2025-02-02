import { ProductProps } from '@/app/utils/data/getProducts';
import { useState } from 'react';
import { BiMinus, BiPlus } from 'react-icons/bi';
import { RiDeleteBin2Fill } from 'react-icons/ri';

export default function Count({
  product,
  count,
}: {
  product: ProductProps;
  count: number;
}) {
  const [number] = useState(count);

  return (
    <div className="flex gap-1 items-center px-5">
      <button
        disabled={count >= product.variety[0].subVariety[0].inventory}
        className="p-1 border rounded-full"
      >
        <BiPlus
          className={`text-lg ${count >= 5 ? 'text-gray-300' : 'text-accent-green'}`}
        />
      </button>
      <p>{number}</p>
      <button className={`p-1 border rounded-full text-lg text-accent-pink`}>
        {count <= 1 ? <RiDeleteBin2Fill /> : <BiMinus />}
      </button>
    </div>
  );
}
