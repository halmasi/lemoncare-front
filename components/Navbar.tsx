'use client';

import { ReactNode, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IoCloseSharp, IoMenu } from 'react-icons/io5';
import SearchInput from './SearchInput';
import Logo from '@/public/lemoncareLogoForHeader.png';

export default function Navbar({ menuItems }: { menuItems: ReactNode }) {
  const [menuState, setMenustate] = useState<boolean>(false);
  const [scrollData, setScrollData] = useState({ y: 0, latestY: 0 });
  const [visibility, setVisibility] = useState<boolean>(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrollData((prevState) => {
        return {
          y: window.scrollY,
          latestY: prevState.y,
        };
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (scrollData.latestY < scrollData.y) setVisibility(false);
    else setVisibility(true);
  }, [scrollData]);

  return (
    <header
      className={`w-full border-t-4 border-yellow-500 justify-between z-30 ${
        menuState ? 'fixed' : 'sticky'
      } md:sticky transition-all ease-in duration-300 bg-white md:px-10 py-10 ${
        visibility || menuState ? 'top-0' : '-top-52'
      }`}
    >
      <div
        className={`bg-white ${
          menuState ? 'h-svh overflow-scroll' : 'h-fit'
        } w-screen flex flex-col md:hidden items-center relative space-y-5 px-5`}
      >
        <div className="flex flex-row w-full items-center justify-between">
          {menuState ? (
            <IoCloseSharp
              onClick={() => setMenustate(false)}
              className="text-4xl"
            />
          ) : (
            <IoMenu onClick={() => setMenustate(true)} className="text-4xl" />
          )}
          <Link href="/">
            <Image
              width={Logo.width}
              height={Logo.height}
              src={Logo.src}
              alt="LemonCare Logo"
              className="h-10 w-auto drop-shadow-lg"
            />
          </Link>
        </div>
        <div className={`w-full ${menuState ? 'flex flex-col' : 'hidden'}`}>
          <SearchInput />
          <div className="flex flex-col w-full h-[80svh] space-y-5 overflow-scroll">
            {menuItems}
          </div>
        </div>
      </div>
      <div className="hidden items-end md:flex md:flex-row justify-between">
        <div className="flex flex-row items-end w-full space-x-5">
          <Link className="w-fit ml-5" href="/">
            <Image
              width={Logo.width}
              height={Logo.height}
              src={Logo.src}
              alt="LemonCare Logo"
              className="h-10 w-auto drop-shadow-lg"
            />
          </Link>
          {menuItems}
        </div>
        <SearchInput />
      </div>
    </header>
  );
}
