import Link from 'next/link';
import { ReactNode } from 'react';
interface Props {
  children: ReactNode;
  href: string;
  onClick?: () => void;
}
function SubmitButton({ children, href, onClick }: Props) {
  return (
    <Link href={href} passHref>
      <button
        onClick={onClick}
        className="px-6 py-2 text-lg font-semibold rounded-xl bg-accent-green text-background hover:text-accent-pink transition-colors ease-in-out drop-shadow-lg"
      >
        <p className="shadow-foreground drop-shadow-md">{children}</p>
      </button>
    </Link>
  );
}

export default SubmitButton;
