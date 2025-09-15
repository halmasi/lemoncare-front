'use client';

import { ReactNode, useState } from 'react';
import { IoIosCheckmark } from 'react-icons/io';

interface CheckboxProps {
  children: ReactNode;
  //   isSelected: boolean;
  //   isSelectedClass?: string;
  className?: string;
  onClick?: (id: string, checked: boolean) => void;
  id: string;
  isChecked: () => boolean;
  //   showRadioIcon?: boolean;
}

export default function Checkbox({
  children,
  onClick,
  id,
  isChecked = () => {
    return false;
  },
}: CheckboxProps) {
  const [checked, setChecked] = useState<boolean>(isChecked);
  return (
    <div
      onClick={() => {
        if (onClick) onClick(id, !checked);
        setChecked(!checked);
      }}
      className="w-full cursor-pointer flex gap-2  items-center justify-between"
    >
      <p className="w-full">{children}</p>
      <div className="w-5 h-5 aspect-square flex items-center rounded border-2 border-blue-500">
        {checked && <IoIosCheckmark />}
      </div>
      {/* <input className="hidden" id={id} type='checkbox'/> */}
    </div>
  );
}
