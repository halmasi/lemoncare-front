import { ReactNode } from 'react';
import { FaLemon } from 'react-icons/fa';

export default function RadioButton({
  children,
  color,
  group,
  value,
  selectedOptions,
  handler,
}: {
  children: ReactNode;
  color?: string;
  group: string;
  value: { id: number; sub: number | null };
  selectedOptions: { id: number; sub: number | null };
  handler: ({ id, sub }: { id: number; sub: number | null }) => void;
}) {
  const isChecked: boolean = value.sub
    ? selectedOptions.id == value.id && selectedOptions.sub == value.sub
    : selectedOptions.id == value.id;
  return (
    <div
      className={value.sub && selectedOptions.id != value.id ? 'hidden' : ''}
    >
      <input
        id={`radio${value.sub ? `sub${value.sub}` : `parent${value.id}`}`}
        name={group}
        value={value.sub || value.id}
        className={`hidden peer`}
        type="radio"
        checked={isChecked}
        onChange={() => handler(value)}
      />
      <label
        className={`flex cursor-pointer border bg-gray-50 p-2 rounded-lg ${isChecked && 'border-red-900 bg-white'}`}
        htmlFor={`radio${value.sub ? `sub${value.sub}` : `parent${value.id}`}`}
      >
        {children}
        {color != '#000000' && (
          <FaLemon className="text-2xl" style={{ color }} />
        )}
      </label>
    </div>
  );
}
