import { ReactNode } from 'react';
import { FaLemon } from 'react-icons/fa';

export default function RadioButton({
  children,
  color,
  group,
}: {
  children: ReactNode;
  color?: string;
  group: string;
}) {
  return (
    <>
      <input
        id={`radio${color}`}
        name={group}
        value={color}
        className={`hidden peer`}
        type="radio"
      />
      <label
        className={`flex cursor-pointer border bg-none p-2 rounded-lg peer-checked:border-red-900`}
        htmlFor={`radio${color}`}
      >
        {children}
        {color && <FaLemon className="text-2xl" style={{ color }} />}
      </label>
    </>
  );
}
