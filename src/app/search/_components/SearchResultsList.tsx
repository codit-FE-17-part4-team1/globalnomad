'use client';

import React, { useState, useEffect } from 'react';
import ActivitiesCard from '../../main/_components/ActivityCard';
import Pagination from '../../../components/Pagination/Pagination';
import type { Activity } from '@/types/activity';

interface SearchResultsProps {
  results: Activity[];
  keyword: string;
}

type SortOption = 'relevance' | 'latest';

const SearchResults: React.FC<SearchResultsProps> = ({ results, keyword }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleCards, setVisibleCards] = useState<Activity[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [sortOption, setSortOption] = useState<SortOption>('relevance');

  // 화면 크기에 따라 itemsPerPage 설정
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth >= 1024)
        setItemsPerPage(12); // PC
      else if (window.innerWidth >= 768)
        setItemsPerPage(9); // 태블릿
      else setItemsPerPage(8); // 모바일
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  // 관련도 점수 계산
  const relevanceScore = (item: Activity, keyword: string) => {
    let score = 0;
    const lowerKeyword = keyword.toLowerCase();
    const title = item.title.toLowerCase();
    const description = item.description?.toLowerCase() ?? '';

    if (title === lowerKeyword) score += 10;
    else if (title.includes(lowerKeyword)) score += 5;
    if (description.includes(lowerKeyword)) score += 2;

    return score;
  };

  // 정렬 및 페이지네이션 처리
  useEffect(() => {
    const sortedResults = [...results];

    if (sortOption === 'relevance') {
      sortedResults.sort(
        (a, b) => relevanceScore(b, keyword) - relevanceScore(a, keyword)
      );
    } else if (sortOption === 'latest') {
      sortedResults.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;

    setVisibleCards(sortedResults.slice(startIdx, endIdx));

    // 로컬 스토리지에 저장
    localStorage.setItem('searchCurrentPage', currentPage.toString());
    localStorage.setItem('searchItemsPerPage', itemsPerPage.toString());
    localStorage.setItem('searchSortOption', sortOption);
  }, [currentPage, itemsPerPage, results, sortOption, keyword]);

  // 초기 로드 시 로컬 스토리지 값 복원
  useEffect(() => {
    const savedPage = localStorage.getItem('searchCurrentPage');
    const savedPerPage = localStorage.getItem('searchItemsPerPage');
    const savedSort = localStorage.getItem('searchSortOption');

    if (savedPage) setCurrentPage(Number(savedPage));
    if (savedPerPage) setItemsPerPage(Number(savedPerPage));
    if (savedSort === 'relevance' || savedSort === 'latest')
      setSortOption(savedSort);
  }, []);

  const totalPages = Math.max(1, Math.ceil(results.length / itemsPerPage));

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

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
        <div className="flex items-center gap-4">
          <button
            className={`text-lg font-semibold ${
              sortOption === 'relevance' ? 'text-black' : 'text-gray-600'
            }`}
            onClick={() => setSortOption('relevance')}
          >
            <span className="mr-1">•</span>관련도순
          </button>

          <button
            className={`text-lg font-semibold ${
              sortOption === 'latest' ? 'text-black' : 'text-gray-600'
            }`}
            onClick={() => setSortOption('latest')}
          >
            <span className="mr-1">•</span>최신순
          </button>
        </div>
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
            <ActivitiesCard key={exp.id} {...exp} type="sm" />
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
            onPageChange={handlePageChange}
            maxPageButtons={5}
          />
        </div>
      )}
    </div>
  );
};

export default SearchResults;
