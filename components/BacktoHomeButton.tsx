import Link from 'next/link'
import { ReactNode } from 'react'
interface Props {
  children: ReactNode
  href: string
}
function BacktoHomeButton({ children, href }: Props) {
  return (
    <Link href={href} passHref>
      <button className="px-6 py-3 mt-4 text-lg font-semibold rounded-full bg-white text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors duration-300 ease-in-out drop-shadow-lg">
        {children}
      </button>
    </Link>
  )
}

export default BacktoHomeButton
