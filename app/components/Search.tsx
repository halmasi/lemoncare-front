'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import InputBox from './formElements/InputBox';
import { useEffect, useRef } from 'react';

export function Search() {
  const inputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = searchParams.get('query') || '';
    }
  }, [searchParams]);

  const handleSearch = useDebouncedCallback((term: string) => {
    console.log(`Searching... ${term}`);
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');

    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div>
      <InputBox
        type="text"
        placeholder="Search"
        onChange={(e) => handleSearch(e.target.value)}
        ref={inputRef}
        name={'search'}
      />
    </div>
  );
}
