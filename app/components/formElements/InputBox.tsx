import { useState, ReactNode, useEffect } from 'react';
import { LuEye, LuEyeClosed } from 'react-icons/lu';

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
  const [showPassword, setShowPassword] = useState(false);
  const [inputValue, setInputValue] = useState<string | number>(value || '');
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (value) setInputValue(value);
  }, [value]);
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
        type={
          format == 'password'
            ? showPassword
              ? 'text'
              : 'password'
            : format || 'text'
        }
        placeholder={placeholder}
        name={name}
        id={name}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      {format == 'password' && (
        <button
          type="button"
          onClick={togglePassword}
          className="justify-center transform text-black"
        >
          {showPassword ? <LuEyeClosed size={20} /> : <LuEye size={20} />}
        </button>
      )}
    </div>
  );
}
