'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import InputBox from './formElements/InputBox';
import { useEffect, useRef } from 'react';
import SubmitButton from './formElements/SubmitButton';
import { BiSearchAlt2 } from 'react-icons/bi';

export function Search() {
  const inputRef = useRef<HTMLInputElement>(null);

  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = searchParams.get('s-query') || '';
    }
    if (searchParams.get('s-query')) {
      const handleSearchFn = async () => {
        const res = await fetch(`/api/search`, {
          method: 'POST',
          body: JSON.stringify({
            param: searchParams.get('s-query'),
            page: searchParams.get('s-page'),
          }),
        });
        const data = await res.json();
        console.log(data);
      };
      handleSearchFn();
    }
  }, [searchParams]);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('s-page', '1');
    if (term) {
      params.set('s-query', term);
      if (inputRef.current) inputRef.current.value = term;
    }

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="flex flex-row justify-stretch w-full">
      <div className="w-full">
        <InputBox
          type="text"
          placeholder="جستجو مقاله و محصول"
          onChange={(e) => handleSearch(e.target.value)}
          ref={inputRef}
          name={'search'}
          className="rounded-l-none border-l-0 focus:ring-0 focus:outline-none"
        />
      </div>
      <SubmitButton
        className="w-fit bg-white hover:bg-gray-50 border rounded-r-none border-r-0 drop-shadow-none text-foreground/80 hover:text-foreground"
        onClick={() => handleSearch(inputRef.current?.value || '')}
      >
        <BiSearchAlt2 />
      </SubmitButton>
    </div>
  );
}
