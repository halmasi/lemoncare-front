import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  href: string;
}

export default function MenuButton({ children, href }: Props) {
  return (
    <Link className="border-b border-yellow-500" href={href}>
      {children}
    </Link>
  );
}
