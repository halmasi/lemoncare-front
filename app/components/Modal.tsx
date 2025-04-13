import { ReactNode } from 'react';
import { CgClose } from 'react-icons/cg';

export default function Modal({
  children,
  show,
  className,
  onClose,
}: {
  children: ReactNode;
  show: boolean;
  onClose: () => void;
  className?: string;
}) {
  return (
    <div
      className={`${show ? 'fixed' : 'hidden'} inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={`w-fit h-fit min-w-52 min-h-32 rounded-lg bg-background ${className}`}
      >
        <CgClose
          onClick={() => onClose()}
          className="text-xl m-1 p-[0.2 rem] w-fit text-gray-700 hover:text-red-500 cursor-pointer inset-0"
        />
        <div className=" px-2 py-1 md:py-2">{children}</div>
      </div>
    </div>
  );
}
