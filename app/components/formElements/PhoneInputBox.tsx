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
        <div className={`flex w-full items-center`}>
          <input
            className="p-2 border-l-0 border-2 border-gray-400 rounded-r-xl shadow-lg focus:shadow-accent-pink/30 focus:outline-none transition-all text-left w-full h-12"
            type={'tel'}
            dir="ltr"
            placeholder={placeholder}
            name={name}
            id={name}
            ref={ref}
          />
          <div className="flex justify-center items-center px-3 bg-gray-200 border-2 border-r-0 border-gray-400 rounded-l-xl shadow-lg w-28 h-12">
            <h6 className="text-base text-left">98+ ایران</h6>
          </div>
        </div>
      </div>
    );
  }
);
PhoneInputBox.displayName = 'InputBox';

export default PhoneInputBox;
