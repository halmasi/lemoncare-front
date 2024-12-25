import { ReactNode } from 'react';
interface Props {
  children: ReactNode;
  onClick?: () => void;
}
function SubmitButton({ children, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-2 text-lg font-semibold rounded-xl bg-accent-green text-background hover:text-accent-pink transition-colors ease-in-out drop-shadow-lg"
    >
      <p className="shadow-foreground drop-shadow-md">{children}</p>
    </button>
  );
}

export default SubmitButton;
