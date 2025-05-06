'use client';
import { useEffect, useRef, useState } from 'react';

import { IoSearch } from 'react-icons/io5';
import InputBox from '../formElements/InputBox';
export default function SearchInput() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ id: number; title: string }[]>([]);

  const inputboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputboxRef.current) inputboxRef.current.value = query;
  }, [query]);

  const handleSearch = async () => {
    const res = await fetch(`/api/search`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const data = await res.json();
    setResults(JSON.parse(JSON.stringify(data)));
  };

  return (
    <div className="w-full h-fit pb-3 md:pb-0">
      <div className="flex w-full h-fit justify-center items-center border rounded-full hover:border-pink-500 transition-colors">
        <div className="w-full">
          <InputBox
            type="text"
            name="search"
            placeholder="جستجو مقاله یا محصول"
            ref={inputboxRef}
            onChange={(e) => setQuery(e.target.value)}
            className="text-right w-full px-1 h-auto bg-gray-100 rounded-r-full border border-l-0 focus:outline-none caret-pink-800 caret"
          />
        </div>
        <button
          className="pl-3 h-full flex items-center justify-center rounded-l-full  transition-all duration-100 text-gray-500 hover:text-gray-700 hover:text-lg focus:text-gray-950"
          type="submit"
          onClick={handleSearch}
        >
          <IoSearch />
        </button>
        <div>
          {results.map((item) => (
            <div key={item.id} className="p-2 border-b">
              {item.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-fit pb-3 md:pb-0">
      <form className="flex w-full h-fit justify-center border rounded-full hover:border-pink-500 transition-colors">
        <input
          className="text-right w-full px-1 h-auto bg-gray-100 rounded-r-full border border-l-0 focus:outline-none caret-pink-800 caret"
          type="search"
          name="q"
          id="searchbox"
          placeholder="جستجو مقاله یا محصول ..."
        />
        <button
          className="pl-3 h-10 flex items-center justify-center rounded-l-full border border-r-0 transition-all duration-100 bg-gray-100 text-gray-500 hover:text-gray-700 hover:text-lg focus:text-gray-950"
          type="submit"
        >
          <IoSearch />
        </button>
      </form>
    </div>
  );
}
