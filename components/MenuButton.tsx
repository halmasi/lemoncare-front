import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { FaChevronDown } from "react-icons/fa";
interface Props {
	children: ReactNode;
	href: string;
	submenu: boolean;
}

export default function MenuButton({ children, href, submenu }: Props) {
	const path = usePathname();
	return (
		<Link
			className={`flex flex-row border-b items-center text-lg pb-2 px-3 mx-2 ${
				(path.startsWith(href) && href !== "/") || path === href
					? "bg-green-700 rounded-lg text-white md:border-yellow-800 md:text-black md:bg-transparent md:rounded-none"
					: "border-yellow-500 rounded-none"
			}`}
			href={href}
		>
			<p>{children}</p>
			{submenu && <FaChevronDown className='text-xs mr-3 self-end' />}
		</Link>
	);
}
