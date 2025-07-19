import { ChangeEvent, forwardRef, ReactNode } from 'react';

interface PhoneInputProps {
  placeholder: string;
  name: string;
  required?: boolean;
  children?: ReactNode;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}
const PhoneInputBox = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    { placeholder, name, children, required, onChange }: PhoneInputProps,
    ref
  ) => {
    return (
      <div className="flex flex-col md:flex-row w-full items-center">
        {children && (
          <label className="flex w-full md:w-2/12" htmlFor={name}>
            <p>{children}: </p>
            {required && <p className="text-accent-pink"> * </p>}
          </label>
        )}
        <div className={`flex w-full border rounded-md items-center`}>
          <input
            className="p-2 focus:outline-none rounded-md transition-all text-left w-full"
            dir="ltr"
            placeholder={placeholder}
            name={name}
            id={name}
            ref={ref}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              e.target.value = value;
              if (value.length > 11) {
                e.target.value = value.slice(0, 11);
              }
              if (onChange) onChange(e);
            }}
          />
          <div className="flex justify-center items-center px-3 bg-gray-200/50 h-10">
            <p className="text-base text-left">98+</p>
          </div>
        </div>
      </div>
    );
  }
);
PhoneInputBox.displayName = 'InputBox';

export default PhoneInputBox;
