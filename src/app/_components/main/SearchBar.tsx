'use client';

import React, { useState } from 'react';
import MyButton from '@/components/Button/Button';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = () => {
    alert(`검색어: ${query}`);
  };

  return (
    <div className="w-full px-5 flex items-center justify-center">
      <div className="bg-white min-w-[343px] w-full max-w-[1200px] h-[129px] md:h-[184px] py-8 px-6 rounded-2xl shadow-[0_4px_16px_0_rgba(17,34,17,0.05)] flex flex-col justify-between">
        <label className="text-black font-bold text-lg md:text-xl leading-8 mb-4 text-left w-full">
          무엇을 체험하고 싶으신가요?
        </label>
        <div className="flex gap-2 w-full max-w-[1152px] mx-auto">
          <div className="flex items-center flex-1 h-[56px] border bg-white border-gray-700 rounded-sm pl-0 pr-4 py-3">
            <img
              src="/icon/search.svg"
              alt="Search Icon"
              className="w-[48px] h-[48px]"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isFocused ? '' : '내가 원하는 체험은'}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="flex-1 outline-none text-black placeholder-gray-600 font-normal text-md md:text-lg leading-[26px]"
            />
          </div>
          <MyButton
            onClick={handleSearch}
            color="buttonPrimary"
            className="w-[96px] md:w-[136px] h-[56px] flex items-center justify-center rounded"
          >
            검색하기
          </MyButton>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
