import Image from 'next/image';
import Link from 'next/link';
import { FaUserCircle, FaShoppingBasket } from 'react-icons/fa';
import { GrArticle } from 'react-icons/gr';
import Logo from '@/public/lemoncareLogoForHeader.png';
export default function page() {
  return (
    <>
      <header className="p-5 bg-white">
        <nav className="flex flex-wrap gap-2 justify-between">
          <Image
            src={Logo.src}
            width={Logo.width}
            height={Logo.height}
            alt="LemonCare Logo"
            className="h-10 w-auto drop-shadow-lg"
          ></Image>
          <div className=" flex flex-wrap gap-3 items-center">
            <Link
              className="flex items-center gap-1 bg-white transition-colors hover:bg-gray-100 border text-yellow-600 py-1 px-2 rounded-lg"
              href={'/blog'}
            >
              <GrArticle />
              <h6 className="text-sm">مقاله ها</h6>
            </Link>
            <Link
              className="flex items-center gap-1 bg-white transition-colors hover:bg-gray-100 border text-pink-600 py-1 px-2 rounded-lg"
              href={'/shop'}
            >
              <FaShoppingBasket />
              <h6 className="text-sm">فروشگاه</h6>
            </Link>
          </div>
          <Link
            className="flex bg-white transition-colors hover:bg-gray-100 border px-2 rounded-lg items-center md:gap-1"
            href={'/dashboard'}
          >
            <p>ورود کاربر</p>
            <FaUserCircle />
          </Link>
        </nav>
      </header>
      <div>home</div>
    </>
  );
}
