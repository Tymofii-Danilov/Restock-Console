'use client';

import { ChangeEvent, useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import css from './SearchInput.module.css';

type Props = {
  initialValue: string;
};

export default function SearchInput({ initialValue }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const value = inputRef.current?.value.trim() ?? '';
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set('q', value);
      } else {
        params.delete('q');
      }

      params.delete('page');

      const queryString = params.toString();
      const href = queryString ? `${pathname}?${queryString}` : pathname;

      router.replace(href, { scroll: false });
    }, 500);
  };

  useEffect(() => {
    const input = inputRef.current;

    if (input && input.value !== initialValue) {
      input.value = initialValue;
    }
  }, [initialValue]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <label className={css.searchControl}>
      <span className={css.srOnly}>Search products by name</span>
      <span className={css.searchIcon} aria-hidden="true">
        <svg width={10} height={10}>
          <use href="/find.svg"></use>
        </svg>
      </span>
      <input
        ref={inputRef}
        type="search"
        name="search"
        defaultValue={initialValue}
        onChange={handleChange}
        className={css.input}
        placeholder="Search products..."
        aria-label="Search products"
      />
    </label>
  );
}
