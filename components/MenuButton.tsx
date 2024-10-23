import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
interface Props {
  children: ReactNode;
  href: string;
}

export default function MenuButton({ children, href }: Props) {
  const path = usePathname();
  return (
    <Link
      className={`border-b ${
        (path.startsWith(href) && href !== "/") || path === href
          ? "border-yellow-800"
          : "border-yellow-500"
      }`}
      href={href}
    >
      {children}
    </Link>
  );
}
