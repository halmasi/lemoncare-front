'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IoCloseSharp, IoMenu } from 'react-icons/io5';
import SearchInput from './SearchInput';
import Logo from '@/public/lemoncareLogoForHeader.png';
import MenuButton from './MenuButton';
import { MenuProps } from '@/utils/menu';

export default function Navbar({
  menuItems,
}: {
  menuItems?: (MenuProps | undefined)[] | undefined;
}) {
  const [menuState, setMenustate] = useState<boolean>(false);
  const [subMenuHead, setSubMenuHead] = useState<{
    title: string;
    expand: boolean;
  }>({
    title: '',
    expand: false,
  });
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
            {menuItems &&
              menuItems.map((item) => {
                if (item)
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSubMenuHead((prev) => {
                          return {
                            title: item.title,
                            expand: !prev.expand,
                          };
                        });
                      }}
                      className="flex flex-col group"
                    >
                      <MenuButton slug={item.url} submenu={item.subMenu}>
                        {item.title}
                      </MenuButton>
                      {item.subMenu.length > 0 && (
                        <div
                          className={`bg-gray-200 rounded-lg pr-5 ${subMenuHead.title === item.title && subMenuHead.expand ? 'flex' : 'hidden'}`}
                        >
                          {item.subMenu.map((subItem) => (
                            <MenuButton
                              key={subItem.id}
                              submenu={[]}
                              slug={subItem.url}
                            >
                              {subItem.title}
                            </MenuButton>
                          ))}
                        </div>
                      )}
                    </div>
                  );
              })}
          </div>
        </div>
      </div>
      <div className="hidden items-end md:flex md:flex-row justify-between w-full">
        <Link className="w-2/12 ml-5" href="/">
          <Image
            width={Logo.width}
            height={Logo.height}
            src={Logo.src}
            alt="LemonCare Logo"
            className="h-10 w-auto drop-shadow-lg"
          />
        </Link>
        <div className="flex flex-row w-8/12 justify-center ">
          {menuItems &&
            menuItems.map((item) => {
              if (item)
                return (
                  <div key={item.id} className="flex flex-col group">
                    <MenuButton slug={item.url} submenu={item.subMenu}>
                      {item.title}
                    </MenuButton>
                    {item.subMenu.length > 0 && (
                      <div className="hidden group-hover:md:block w-full items-center justify-center">
                        <div className="floating-menu absolute left-0 right-0 w-[80%] rounded-b-lg">
                          <div className="flex flex-row justify-between shadow-xl bg-white rounded-b-lg p-3 mt-10">
                            <div className="w-1/2">
                              <div className="flex flex-col w-fit">
                                {item.subMenu.map((subItem) => (
                                  <MenuButton
                                    key={subItem.id}
                                    submenu={[]}
                                    slug={subItem.url}
                                  >
                                    {subItem.title}
                                  </MenuButton>
                                ))}
                              </div>
                            </div>
                            {item.image && (
                              <Image
                                src={item.image.url}
                                priority
                                alt={item.title + '-image'}
                                width={item.image.width / 5}
                                height={item.image.height / 5}
                                className="object-contain w-1/2"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
            })}
        </div>
        <div className="w-2/12">
          <SearchInput />
        </div>
      </div>
    </header>
  );
}
