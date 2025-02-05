import { useEffect, useState } from 'react';
import { BiMinus, BiPlus } from 'react-icons/bi';
import { RiDeleteBin2Fill } from 'react-icons/ri';

export default function Count({
  count,
  inventory,
  changeAmount,
}: {
  inventory: number;
  count: number;
  changeAmount: (amount: number) => void;
}) {
  const [number, setNumber] = useState(count);

  useEffect(() => {
    if (count > inventory) setNumber(inventory);
    changeAmount(number);
  }, [number]);

  const increase = () => {
    setNumber(number + 1);
  };
  const decrease = () => {
    setNumber(number - 1);
  };

  return (
    <div className="flex h-7 bg-white border w-fit rounded-lg overflow-hidden items-center">
      <button
        onClick={increase}
        disabled={number >= inventory}
        className={`p-1 border-l ${number < inventory && 'hover:bg-gray-50'}`}
      >
        <BiPlus
          className={`text-lg ${number >= inventory ? 'text-gray-300' : 'text-accent-green'}`}
        />
      </button>
      <p className="w-8 text-center">{number}</p>
      <button
        onClick={decrease}
        disabled={number <= 0}
        className={`p-1 text-lg hover:bg-gray-50 border-r text-accent-pink`}
      >
        {number <= 1 ? <RiDeleteBin2Fill /> : <BiMinus />}
      </button>
    </div>
  );
}
