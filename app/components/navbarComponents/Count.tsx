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
    <div className="flex gap-1 items-center px-5">
      <button
        onClick={increase}
        disabled={number >= inventory}
        className="p-1 border rounded-full"
      >
        <BiPlus
          className={`text-lg ${number >= inventory ? 'text-gray-300' : 'text-accent-green'}`}
        />
      </button>
      <p>{number}</p>
      <button
        onClick={decrease}
        disabled={number <= 0}
        className={`p-1 border rounded-full text-lg text-accent-pink`}
      >
        {number <= 1 ? <RiDeleteBin2Fill /> : <BiMinus />}
      </button>
    </div>
  );
}
