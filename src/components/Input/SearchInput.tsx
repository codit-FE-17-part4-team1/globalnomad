'use client';

import { ChangeEvent } from 'react';
import Image from 'next/image';

type SearchInputProps = {
  id: string;
  name: string;
  placeholder?: string;
  value?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function SearchInput({
  id,
  name,
  placeholder = '검색어를 입력하세요',
  value,
  onChange,
}: SearchInputProps) {
  return (
    <div className="relative w-full mb-4">
      <Image
        src="/icon/search.svg"
        alt="검색"
        width={40}
        height={40}
        className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        id={id}
        name={name}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-4 rounded-md border
          border-gray-700 focus:outline-none
          text-gray-800 placeholder-gray-600"
      />
    </div>
  );
}
