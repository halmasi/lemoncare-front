'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/public/lemoncareLogoForHeader.png';
import MenuButton from './MenuButton';
import { AnimatePresence, motion } from 'framer-motion';
import { HamburgerMenuButton } from './HamburgerMenuBotton';
import { usePathname } from 'next/navigation';
import Cart from './CartButton';
import ProfileDropDown from '../profile/ProfileDropDown';
import { MenuProps } from '@/app/utils/schema/menuProps';
import { Search } from '../Search';

export default function Navbar({
  blog,
  shop,
}: {
  blog: MenuProps[];
  shop: MenuProps[];
}) {
  const [menuState, setMenuState] = useState<boolean>(false);
  const [subMenuHead, setSubMenuHead] = useState<{
    title: string;
    expand: boolean;
  }>({
    title: '',
    expand: false,
  });
  const [menuItems, setMenuItems] = useState<MenuProps[]>(shop);

  const [scrollData, setScrollData] = useState({ y: 0, latestY: 0 });
  const [visibility, setVisibility] = useState<boolean>(true);
  const path = usePathname();

  useEffect(() => {
    setMenuItems(shop);
    if (path.startsWith('/blog')) {
      setMenuItems(blog);
    }
  }, [path.startsWith('/blog')]);

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
    if (scrollData.latestY < scrollData.y && window.scrollY > 140)
      setVisibility(false);
    else setVisibility(true);
  }, [scrollData]);

  return (
    <>
      <header
        className={`sticky z-20 transition-all duration-500 ${menuState ? 'fixed' : 'sticky'} ${visibility || menuState ? 'top-0 sticky' : '-top-52'}`}
      >
        <div
          className={`flex flex-col items-center w-full border-t-4 border-accent-pink justify-between shadow-lg bg-white md:px-10 pb-5 pt-10 gap-2`}
        >
          <motion.div
            className="flex flex-col md:hidden bg-white w-full relative space-y-5 px-5"
            initial={{ opacity: 1, height: 'auto' }}
            animate={menuState ? { height: 'full' } : { height: 'auto' }}
            exit={{ height: 'auto' }}
            transition={{
              duration: 0.3,
              ease: 'easeInOut',
            }}
          >
            <div className="flex flex-row w-full items-center justify-between">
              <HamburgerMenuButton
                isOpen={menuState}
                // color="rgb(21 128 61)"
                strokeWidth={4}
                lineProps={{ strokeLinecap: 'round' }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                height={15}
                onClick={() => setMenuState(!menuState)}
              />
              <Link onClick={() => setMenuState(false)} href="/">
                <Image
                  width={100}
                  height={100}
                  src={Logo.src}
                  alt="LemonCare Logo"
                  className="h-10 w-auto drop-shadow-lg"
                />
              </Link>
            </div>
            <motion.div
              className={`w-full flex flex-col`}
              initial={{ opacity: 0, x: 500, height: 0 }}
              animate={
                menuState
                  ? { opacity: 1, x: 0, height: 'auto' }
                  : { opacity: 0, x: 500, height: 0 }
              }
              exit={{ opacity: 0, x: 500, height: 0 }}
              transition={{
                duration: 0.3,
                ease: 'easeInOut',
              }}
            >
              <Search />
              <div className="flex flex-col w-full h-[80svh] space-y-5 overflow-scroll">
                {menuItems &&
                  menuItems.length > 0 &&
                  menuItems.map((item) => {
                    if (item)
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSubMenuHead((prev) => {
                              let expand = true;
                              if (prev.expand && prev.title === item.title)
                                expand = false;
                              else if (prev.expand && prev.title !== item.title)
                                expand = true;
                              return {
                                title: item.title,
                                expand,
                              };
                            });
                          }}
                          className="flex flex-col group"
                        >
                          <div className="bg-white z-10">
                            <MenuButton
                              isClicked={
                                subMenuHead.title === item.title &&
                                subMenuHead.expand
                              }
                              func={() => setMenuState(false)}
                              slug={item.url}
                              submenu={item.subMenu}
                            >
                              <h6 className="text-sm">{item.title}</h6>
                            </MenuButton>
                          </div>
                          {item.subMenu && item.subMenu.length > 0 && (
                            <div className="overflow-hidden">
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={
                                  subMenuHead.title === item.title &&
                                  subMenuHead.expand
                                    ? { opacity: 1, height: 'auto' }
                                    : { opacity: 0, height: 0 }
                                }
                                exit={{ opacity: 0, height: 0 }}
                                transition={{
                                  duration: 0.3,
                                  ease: 'easeInOut',
                                }}
                              >
                                <div className={`flex bg-gray-50 pr-5`}>
                                  {item.subMenu.map((subItem) => (
                                    <MenuButton
                                      key={subItem.id}
                                      func={() => setMenuState(false)}
                                      submenu={[]}
                                      slug={subItem.url}
                                    >
                                      <h6 className="text-sm">
                                        {subItem.title}
                                      </h6>
                                    </MenuButton>
                                  ))}
                                </div>
                              </motion.div>
                            </div>
                          )}
                        </div>
                      );
                  })}
              </div>
            </motion.div>
          </motion.div>
          <div className="hidden items-end md:flex md:flex-row justify-between w-full max-w-screen-xl">
            <div className="w-2/12">
              <Link className="w-fit inline-block" href="/">
                <Image
                  width={100}
                  height={100}
                  src={Logo.src}
                  alt="LemonCare Logo"
                  className="h-10 w-auto drop-shadow-lg"
                />
              </Link>
            </div>
            <div className="flex flex-row items-center w-10/12 justify-start">
              {menuItems &&
                menuItems.length > 0 &&
                menuItems.map((item) => {
                  if (item)
                    return (
                      <div
                        onMouseOver={() => {
                          setMenuState(true);
                          setSubMenuHead(() => {
                            return {
                              title: item.title,
                              expand: true,
                            };
                          });
                        }}
                        onMouseOut={() => {
                          setMenuState(false);
                          setSubMenuHead(() => {
                            return {
                              title: '',
                              expand: false,
                            };
                          });
                        }}
                        key={item.id}
                        className="flex flex-col"
                      >
                        <MenuButton slug={item.url} submenu={item.subMenu}>
                          <h6 className="text-sm">{item.title}</h6>
                        </MenuButton>
                        {item.subMenu && item.subMenu.length > 0 && (
                          <AnimatePresence>
                            <div className="w-full overflow-hidden">
                              <AnimatePresence>
                                {subMenuHead.title === item.title &&
                                  subMenuHead.expand && (
                                    <motion.div
                                      initial={{ opacity: 0, y: 15 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: 15 }}
                                      style={{}}
                                      transition={{
                                        duration: 0.3,
                                        ease: 'easeOut',
                                      }}
                                      className="absolute floating-menu left-0 right-0 top-24 w-[80%] bg-white rounded-b-lg"
                                    >
                                      <div className="flex flex-row justify-between p-3 mt-14 rounded-b-lg shadow-xl">
                                        <div className="w-1/2">
                                          <div className="flex flex-col w-fit">
                                            {item.subMenu.map((subItem) => (
                                              <MenuButton
                                                key={subItem.id}
                                                submenu={[]}
                                                slug={subItem.url}
                                              >
                                                <h6 className="text-sm">
                                                  {subItem.title}
                                                </h6>
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
                                    </motion.div>
                                  )}
                              </AnimatePresence>
                            </div>
                          </AnimatePresence>
                        )}
                      </div>
                    );
                })}
            </div>
          </div>
          <div className="w-full max-w-screen-xl px-20 hidden md:flex items-center justify-between gap-2">
            <div className="w-9/12 px-10">
              <Search />
            </div>
            <div className="flex w-3/12 items-center gap-3">
              <div className="">
                <ProfileDropDown />
              </div>
              <p>|</p>
              <Cart />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
