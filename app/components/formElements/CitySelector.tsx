'use client';

import { useEffect, useRef, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';

export default function CitySelector({
  cities,
  placeholder,
  onChangeFn,
  id,
  className,
}: {
  cities: { name: string; id: number }[];
  placeholder: string;
  onChangeFn: (selected: string, id: number) => void;
  id: string;
  className?: string;
}) {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState('');

  const clickRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (clickRef.current && !clickRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [clickRef]);

  return (
    <div id={id} ref={clickRef} className="w-full">
      <div
        className={`relative w-full bg-white p-2 flex items-center justify-between rounded-lg border ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedCity ?? placeholder}</span>
        {isOpen ? <BiChevronUp /> : <BiChevronDown />}
      </div>
      <ul
        className={`bg-white border rounded p-2 absolute z-20 overflow-y-auto max-h-0 ${isOpen ? 'max-h-60' : 'opacity-0 h-0'} transition-all`}
        style={{ width: clickRef.current?.offsetWidth }}
      >
        <div className="flex items-center w-full px-1 sticky top-0 bg-white rounded-xl border">
          <AiOutlineSearch />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            className="placeholder:text-gray-500 w-full p-2 outline-none"
          />
        </div>
        {cities.map((singleCity) => (
          <li
            key={singleCity.name + singleCity.id}
            className={`p-2 text-sm cursor-pointer hover:bg-accent-yellow/25 hover:text-accent-pink ${singleCity.name == selectedCity && 'bg-accent-yellow/25 text-accent-pink'} ${!singleCity.name.startsWith(inputValue) && 'hidden'}`}
            onClick={() => {
              setSelectedCity(singleCity.name);
              setInputValue('');
              setIsOpen(false);
              onChangeFn(singleCity.name, singleCity.id);
            }}
          >
            {singleCity.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
