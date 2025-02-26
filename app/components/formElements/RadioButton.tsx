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
  value: { id: number; sub: number | null; uid: number; usub: number | null };
  selectedOptions: {
    id: number;
    sub: number | null;
  };
  handler: ({
    id,
    sub,
    uid,
    usub,
  }: {
    id: number;
    sub: number | null;
    uid: number;
    usub: number | null;
  }) => void;
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
        className={`flex cursor-pointer border bg-gray-50 p-2 rounded-lg items-center justify-center gap-1 ${isChecked && 'border-accent-pink bg-white'}`}
        htmlFor={`radio${value.sub ? `sub${value.sub}` : `parent${value.id}`}`}
      >
        <div className="flex items-center justify-center h-5 w-5 rounded-full bg-foreground">
          <div
            className={`w-[80%] h-[80%] ${isChecked ? 'bg-foreground' : 'bg-background'} border-2 border-background rounded-full`}
          ></div>
        </div>
        {children}
        {color != '#000000' && (
          <FaLemon className="text-2xl" style={{ color }} />
        )}
      </label>
    </div>
  );
}
