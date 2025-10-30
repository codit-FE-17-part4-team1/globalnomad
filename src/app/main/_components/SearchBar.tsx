'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import MyButton from '@/components/Button/Button';

type SearchBarProps = {
  onSearchFocus?: () => void; // 클릭 시 필터 초기화
  onSearch?: (keyword: string) => void; // 검색 실행
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearchFocus, onSearch }) => {
  const searchParams = useSearchParams();

  // URL에서 keyword 파라미터 읽기
  const initialKeyword = searchParams.get('keyword') || '';
  const [keyword, setKeyword] = useState(initialKeyword);
  const [isFocused, setIsFocused] = useState(false);

  // URL 파라미터 변경 시 검색창 내용 업데이트
  useEffect(() => {
    setKeyword(initialKeyword);
  }, [initialKeyword]);

  const handleSearch = () => {
    if (!keyword.trim()) {
      alert('검색어를 입력해주세요');
      return;
    }
    if (onSearch) onSearch(keyword); // 부모에게 onSearch(keyword) 를 전달함
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <section className="w-full px-5">
      <div className="bg-white min-w-[335px] w-full max-w-[1200px] h-[129px] md:h-[184px] py-4 md:py-8 px-6 rounded-2xl shadow-[0_4px_16px_0_rgba(17,34,17,0.05)] flex flex-col justify-between mx-auto">
        <label className="text-black font-bold text-lg md:text-xl leading-8 mb-1 md:mb-4">
          무엇을 체험하고 싶으신가요?
        </label>

        <div className="flex gap-2 w-full max-w-[1152px] mx-auto">
          <div className="relative flex items-center flex-1 h-[56px] border border-gray-700 rounded-sm pl-[48px] pr-4 py-3 bg-white">
            <Image
              src="/icon/search.svg"
              alt="Search Icon"
              width={48}
              height={48}
              className="absolute left-0"
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
              onChange={(e) => setKeyword(e.target.value)}
              onFocus={() => {
                setIsFocused(true);
                if (onSearchFocus) onSearchFocus();
              }}
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
