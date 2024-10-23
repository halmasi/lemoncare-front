"use client";
import { useEffect, useState } from "react";
import MenuButton from "./MenuButton";

export default function Navbar() {
  const [visibility, setVisibility] = useState<boolean>(true);
  let scrollValue = 0;
  const [number, setNumber] = useState(0);

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
      className={`flex flex-row items-center justify-between sticky z-40 transition-all ease-in duration-200 bg-white py-2 px-10 h-24 ${
        visibility ? "top-0" : "-top-32"
      }`}
    >
      <div className="flex flex-row space-x-5">
        <MenuButton href="/">home</MenuButton>
        <MenuButton href="/blog">blogs</MenuButton>
      </div>
    </header>
  );
}
