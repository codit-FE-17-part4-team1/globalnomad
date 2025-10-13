'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import MainBanner from '@/app/main/_components/MainBanner';
import SearchBar from '@/app/main/_components/SearchBar';
import SearchResultsList from './_components/SearchResultsList';

import { DummyActivities } from '@/app/main/data/DummyData';

const SearchPage: React.FC = () => {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') || '';

  // 임시로 더미데이터를 필터링해서 keyword와 연동
  const filteredResults = DummyActivities.filter((item) =>
    item.title.includes(keyword)
  );

  return (
    <main className="w-full flex flex-col items-center">
      {/* 배너 + 검색 영역 */}
      <div className="relative w-full">
        <MainBanner />
        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-2/3 z-10 w-full max-w-[1240px]">
          <SearchBar />
        </div>
      </div>

      {/* 검색 결과 리스트 */}
      <div className="w-full my-30 md:my-40">
        <SearchResultsList results={filteredResults} keyword={keyword} />
      </div>
    </main>
  );
};

export default SearchPage;
