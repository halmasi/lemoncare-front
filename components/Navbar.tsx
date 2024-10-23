"use client";
import { useEffect, useState } from "react";
import MenuButton from "./MenuButton";
import SearchInput from "./SearchInput";

export default function Navbar() {
  const [visibility, setVisibility] = useState<boolean>(true);
  let scrollValue = 0;

  const menuItems = [
    { id: 1, href: "/", title: "خانه", subMenu: false },
    { id: 2, href: "/skincare", title: "پوست", subMenu: true },
    { id: 3, href: "/haircare", title: "مو", subMenu: false },
  ];
  const controlNav = () => {
    if (scrollValue <= window.scrollY) {
      scrollValue = window.scrollY;
      setVisibility(false);
    } else {
      scrollValue = window.scrollY - 1;
      setVisibility(true);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNav);
    return () => {
      window.removeEventListener("scroll", controlNav);
    };
  }, []);

  return (
    <header
      className={` border-t-4 border-yellow-500 flex flex-row items-center justify-between sticky z-40 transition-all ease-in duration-200 bg-white py-2 px-10 h-24 ${
        visibility ? "top-0" : "-top-32"
      }`}
    >
      <SearchInput />
      <div className="flex flex-row space-x-5">
        {menuItems.map((item) => (
          <MenuButton key={item.id} href={item.href} submenu={item.subMenu}>
            {item.title}
          </MenuButton>
        ))}
      </div>
    </header>
  );
}
