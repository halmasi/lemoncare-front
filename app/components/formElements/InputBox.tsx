import { ReactNode } from 'react';

interface InputProps {
  format?: string;
  placeholder: string;
  name: string;
  value?: string | number;
  required?: boolean;
  children?: ReactNode;
}

export default function InputBox({
  format,
  placeholder,
  value,
  name,
  required,
  children,
}: InputProps) {
  return (
    <div className="flex flex-col md:flex-row items-center">
      {children && (
        <label className="flex w-full md:w-2/12" htmlFor={name}>
          <p>{children}: </p>
          {required && <p className="text-accent-pink"> * </p>}
        </label>
      )}
      <input
        className={`w-full p-2 border-2 border-gray-400 rounded-xl shadow-lg focus:shadow-accent-pink/30 focus:outline-none transition-all`}
        type={format || 'text'}
        placeholder={placeholder}
        name={name}
        id={name}
        value={value}
      />
    </div>
  );
}
