import { ReactNode } from 'react';
interface Props {
  children: ReactNode;
  onClick?: () => void;
  disabled: boolean;
}
export default function SubmitButton({ children, disabled, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      className={`px-6 py-2 text-lg font-semibold rounded-xl bg-accent-green text-background hover:text-accent-pink transition-colors ease-in-out drop-shadow-lg
        ${disabled ? 'opacity-50 cursor-progress' : ''}`}
    >
      <p className="shadow-foreground drop-shadow-md">{children}</p>
    </button>
  );
}
