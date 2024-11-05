import Link from 'next/link';
import { ReactNode } from 'react';
interface Props {
  children: ReactNode;
  href: string;
  onClick?: () => void;
}
function ColoredButton({ children, href, onClick }: Props) {
  return (
    <Link href={href} passHref>
      <button
        onClick={onClick}
        className="px-6 py-3 mt-4 text-lg font-semibold rounded-full bg-white text-green-400 hover:bg-yellow-400 hover:text-white transition-colors duration-300 ease-in-out drop-shadow-lg"
      >
        {children}
      </button>
    </Link>
  );
}

export default ColoredButton;
