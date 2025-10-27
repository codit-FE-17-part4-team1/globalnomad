'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import SortOptions from './SortOptions';
import ActivitiesCard from '../../main/_components/ActivityCard';
import Pagination from '../../../components/Pagination/Pagination';
import type { Activity } from '@/types/activity';

interface SearchResultsProps {
  results: Activity[];
  keyword: string;
  currentPage: number;
  itemsPerPage: number;
  sortOption: 'relevance' | 'latest';
  onPageChange: (page: number) => void;
  onSortChange: (option: 'relevance' | 'latest') => void;
}

const SearchResultsList: React.FC<SearchResultsProps> = ({
  results,
  keyword,
  currentPage,
  itemsPerPage,
  sortOption,
  onPageChange,
  onSortChange,
}) => {
  const router = useRouter();
  // 페이지네이션 계산
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const visibleCards = results.slice(startIdx, endIdx);

  return (
    <div className="w-full max-w-[1240px] mx-auto px-5">
      <h2 className="text-black text-2xl lg:text-3xl leading-[100%] mb-4">
        <span className="font-bold">{keyword}</span>
        <span className="font-normal"> 에 대한 검색 결과입니다</span>
      </h2>

      <div className="flex justify-between items-center mb-4">
        <p className="text-black text-lg font-normal">
          총 {results.length}개의 결과
        </p>

        {/* 정렬 옵션 */}
        <SortOptions sortOption={sortOption} onSortChange={onSortChange} />
      </div>

      {/* 카드 영역 */}
      <div
        className={[
          'grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center',
          visibleCards.length > 0
            ? 'items-start'
            : 'items-center justify-center h-[300px] md:h-[500px] lg:h-[900px]',
        ].join(' ')}
      >
        {visibleCards.length > 0 ? (
          visibleCards.map((exp) => (
            <ActivitiesCard
              key={exp.id}
              {...exp}
              type="sm"
              onClick={() => router.push(`/activities/${exp.id}`)}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center text-gray-500 text-xl md:text-2xl font-medium">
            검색 결과가 없습니다😅
          </div>
        )}
      </div>

      {/* Pagination */}
      {results.length > 0 && (
        <div className="mt-[50px] mb-[150px]">
          <Pagination
            totalItems={results.length}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={onPageChange}
            maxPageButtons={5}
          />
        </div>
      )}
    </div>
  );
};

export default SearchResultsList;
