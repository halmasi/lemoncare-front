import { forwardRef, ReactNode } from 'react';

interface PhoneInputProps {
  placeholder: string;
  name: string;
  required?: boolean;
  children?: ReactNode;
}
const PhoneInputBox = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ placeholder, name, children, required }: PhoneInputProps, ref) => {
    return (
      <div className="flex flex-col md:flex-row w-full items-center">
        {children && (
          <label className="flex w-full md:w-2/12" htmlFor={name}>
            <p>{children}: </p>
            {required && <p className="text-accent-pink"> * </p>}
          </label>
        )}
        <div
          className={`flex w-full border rounded-md border-gray-300 items-center`}
        >
          <input
            className="p-2 focus:outline-none transition-all text-left w-full"
            type={'tel'}
            dir="ltr"
            placeholder={placeholder}
            name={name}
            id={name}
            ref={ref}
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
