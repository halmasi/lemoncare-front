import Link from 'next/link';
import { ReactNode } from 'react';
interface Props {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  isPending?: boolean;
  link?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  title?: string;
}
export default function SubmitButton({
  children,
  disabled,
  isPending,
  onClick,
  link,
  className,
  type,
  title = '',
}: Props) {
  return link ? (
    <Link
      title={title}
      className={`flex px-6 py-2 rounded-lg border text-foreground bg-gray-50 hover:text-background/80 hover:bg-accent-green/80 transition-colors ease-in-out drop-shadow-md
    ${disabled && 'opacity-50 cursor-not-allowed'} ${isPending && 'cursor-progress opacity-50'} ${className}`}
      href={link}
      onClick={onClick}
    >
      {children}
    </Link>
  ) : (
    <button
      onClick={onClick}
      disabled={disabled || isPending}
      aria-disabled={disabled || isPending}
      type={type ? type : 'submit'}
      title={title}
      className={`flex px-6 py-2 rounded-lg border text-foreground bg-gray-50 hover:text-background/80 hover:bg-accent-green/80 transition-colors ease-in-out drop-shadow-md
        ${disabled && 'opacity-50 cursor-not-allowed'} ${isPending && 'cursor-progress opacity-50'} ${className}`}
    >
      {children}
    </button>
  );
}
