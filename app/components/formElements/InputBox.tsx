import { useState, ReactNode, useEffect } from 'react';
import { LuEye, LuEyeClosed } from 'react-icons/lu';
import { forwardRef } from 'react';

interface InputProps {
  format?: string;
  placeholder: string;
  name: string;
  value?: string | number;
  required?: boolean;
  children?: ReactNode;
  className?: string;
  labelClassName?: string;
  flex?: 'row' | 'col';
}

const InputBox = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      format,
      placeholder,
      name,
      required,
      children,
      className,
      labelClassName,
      flex,
    }: InputProps,
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const togglePassword = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div
        className={`flex flex-col items-center ${flex && flex == 'col' ? 'md:flex-col md:items-start' : 'md:flex-row'}`}
      >
        {children && (
          <label
            className={`flex w-full ${flex && flex == 'col' ? '' : 'md:w-2/12'} ${labelClassName}`}
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
          ref={ref}
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
);

export default InputBox;
