import { ReactNode } from 'react';
import {
  IoRadioButtonOffOutline,
  IoRadioButtonOnOutline,
} from 'react-icons/io5';

interface RadioButtonProps {
  children: ReactNode;
  isSelected: boolean;
  isSelectedClass?: string;
  className?: string;
  onClick: (id: string) => void;
  id: string;
  showRadioIcon?: boolean;
}

export default function RadioButton({
  children,
  isSelected,
  className,
  onClick,
  id,
  isSelectedClass,
  showRadioIcon = true,
}: RadioButtonProps) {
  return (
    <div className={className + ' ' + isSelectedClass}>
      <div
        onClick={() => {
          onClick(id);
        }}
        className={`flex w-full h-fit justify-between rounded-lg p-2 border cursor-pointer ${className} ${isSelectedClass}`}
      >
        {children}
        {showRadioIcon && (
          <div className="self-center h-fit w-fit">
            {isSelected ? (
              <IoRadioButtonOnOutline className="fill-accent-pink text-gray-400 text-xl" />
            ) : (
              <IoRadioButtonOffOutline className="fill-accent-pink text-gray-400 text-xl" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
