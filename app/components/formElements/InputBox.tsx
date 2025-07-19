import { useState, ReactNode } from 'react';
import { LuEye, LuEyeClosed } from 'react-icons/lu';
import { forwardRef } from 'react';
import { convertPersianAndArabicToEnglish } from '@/app/utils/miniFunctions';

interface InputProps {
  type?: string;
  placeholder?: string;
  name: string;
  required?: boolean;
  children?: ReactNode;
  className?: string;
  labelClassName?: string;
  flex?: 'row' | 'col';
  ltr?: boolean;
  showEye?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const InputBox = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type,
      placeholder,
      name,
      required,
      children,
      className,
      labelClassName,
      flex,
      ltr,
      onChange,
      onFocus,
      showEye = true,
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
        <div className="w-full h-fit rounded-md border flex items-center gap-1">
          <input
            className={`w-full p-2 focus:outline-none rounded-md transition-all ${type == 'password' && 'rounded-l-none border-l-0'} ${className} ${ltr && 'ltr'}`}
            onFocus={onFocus}
            onChange={(e) => {
              e.preventDefault();
              if (type != 'password') {
                const englishNumbers = convertPersianAndArabicToEnglish(
                  e.target.value
                );
                e.target.value = englishNumbers;
              }
              if (onChange) onChange(e);
            }}
            type={
              type == 'password'
                ? showPassword
                  ? 'text'
                  : 'password'
                : type || 'text'
            }
            placeholder={placeholder}
            name={name}
            id={name}
            ref={ref}
            dir={ltr ? 'ltr' : 'rtl'}
          />

          {type == 'password' && showEye && (
            <button
              type="button"
              onClick={togglePassword}
              className="flex w-fit p-1 justify-center transform text-black"
            >
              {showPassword ? <LuEyeClosed size={20} /> : <LuEye size={20} />}
            </button>
          )}
        </div>
      </div>
    );
  }
);

InputBox.displayName = 'InputBox';
export default InputBox;
