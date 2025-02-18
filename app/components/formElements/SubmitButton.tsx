import Link from 'next/link';
import { ReactNode } from 'react';
interface Props {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  link?: string;
}
export default function SubmitButton({
  children,
  disabled,
  onClick,
  link,
}: Props) {
  return link ? (
    <Link
      className={`flex px-6 py-2 text-lg font-semibold rounded-lg bg-accent-green text-background hover:text-background/80 transition-colors ease-in-out drop-shadow-lg
    ${disabled ? 'opacity-50 cursor-progress' : ''}`}
      href={link}
    >
      <p className="shadow-foreground drop-shadow-md">{children}</p>
    </Link>
  ) : (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      className={`px-6 py-2 text-lg font-semibold rounded-lg bg-accent-green text-background hover:text-background/80 transition-colors ease-in-out drop-shadow-lg
        ${disabled ? 'opacity-50 cursor-progress' : ''}`}
    >
      <p className="flex items-center gap-2 shadow-foreground drop-shadow-md">
        {children}
      </p>
    </button>
  );
}
