import { ReactNode } from 'react';

interface InputProps {
  format?: string;
  placeholder: string;
  name: string;
  value?: string | number;
  required?: boolean;
  children?: ReactNode;
  className?: string;
  flex?: 'row' | 'col';
}

export default function InputBox({
  format,
  placeholder,
  value,
  name,
  required,
  children,
  className,
  flex,
}: InputProps) {
  return (
    <div
      className={`flex flex-col items-center ${flex && flex == 'col' ? 'md:flex-col md:items-start' : 'md:flex-row'}`}
    >
      {children && (
        <label
          className={`flex w-full ${flex && flex == 'col' ? '' : 'md:w-2/12'}`}
          htmlFor={name}
        >
          <p>{children}: </p>
          {required && <p className="text-accent-pink"> * </p>}
        </label>
      )}
      <input
        className={
          `w-full p-2 border rounded-xl focus:shadow-accent-pink/30 focus:outline-none transition-all ` +
          className
        }
        type={format || 'text'}
        placeholder={placeholder}
        name={name}
        id={name}
        value={value}
      />
    </div>
  );
}
