'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import MyButton from '@/components/Button/Button';

const SearchBar: React.FC = () => {
  const router = useRouter();
  const [keyword, setkeyword] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = () => {
    if (!keyword.trim()) {
      alert('검색어를 입력해주세요');
      return;
    }
    router.push(`/search?keyword=${encodeURIComponent(keyword)}`);
  };

  // 엔터 키 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="w-full px-5">
      <div className="bg-white min-w-[335px] w-full max-w-[1200px] h-[129px] md:h-[184px] py-4 md:py-8 px-6 rounded-2xl shadow-[0_4px_16px_0_rgba(17,34,17,0.05)] flex flex-col justify-between mx-auto">
        {/* 제목 */}
        <label className="text-black font-bold text-lg md:text-xl leading-8 mb-1 md:mb-4">
          무엇을 체험하고 싶으신가요?
        </label>

        {/* 검색 영역 */}
        <div className="flex gap-2 w-full max-w-[1152px] mx-auto">
          <div className="relative flex items-center flex-1 h-[56px] border border-gray-700 rounded-sm pl-[48px] pr-4 py-3 bg-white">
            <img
              src="/icon/search.svg"
              alt="Search Icon"
              className="absolute left-0 w-[48px] h-[48px]"
            />
            {/* 플로팅 라벨 */}
            <label
              className={`absolute left-[40px] lg:left-[50px] w-[130px] h-[26px] flex items-center justify-center bg-white text-gray-500 font-normal text-md md:text-lg leading-[26px] transition-transform duration-200 ease-out pointer-events-none
                ${isFocused || keyword ? 'translate-y-[-120%]' : 'top-1/2 -translate-y-1/2'}`}
            >
              내가 원하는 체험은
            </label>

            <input
              type="text"
              value={keyword}
              onChange={(e) => setkeyword(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              className="w-full max-w-[1000px] min-w-[130px] outline-none text-black font-normal text-md md:text-lg leading-[26px] bg-transparent"
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
    </section>
  );
};

export default SearchBar;
