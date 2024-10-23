import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
interface Props {
  children: ReactNode;
  href: string;
  submenu: boolean;
}

export default function MenuButton({ children, href, submenu }: Props) {
  const path = usePathname();
  return (
    <Link
      className={`flex flex-row border-b text-lg ${
        (path.startsWith(href) && href !== "/") || path === href
          ? "border-yellow-800"
          : "border-yellow-500"
      }`}
      href={href}
    >
      {submenu && <p className="text-gray-500 text-xs self-end mr-1">˅</p>}
      {children}
    </Link>
  );
}
