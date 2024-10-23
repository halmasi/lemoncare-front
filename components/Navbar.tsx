"use client";
import { useEffect, useState } from "react";

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
      className={`sticky z-40 transition-all ease-in duration-200 bg-white h-24 ${
        visibility ? "top-0" : "-top-32"
      }`}
    >
      <h2 className="">Navbar</h2>
      <button
        onClick={() => {
          setNumber(number + 1);
        }}
      >
        click me {number}
      </button>
    </header>
  );
}
