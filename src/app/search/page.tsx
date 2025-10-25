'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import MainBanner from '@/app/main/_components/MainBanner';
import SearchBar from '@/app/main/_components/SearchBar';
import SearchResultsList from './_components/SearchResultsList';
import type { Activity } from '@/types/activity';

const SearchPage: React.FC = () => {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') || '';

  // 상태 관리
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [sortOption, setSortOption] = useState<'relevance' | 'latest'>(
    'relevance'
  );

  // 화면 크기에 따라 itemsPerPage 설정
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth >= 1024) setItemsPerPage(12);
      else if (window.innerWidth >= 768) setItemsPerPage(9);
      else setItemsPerPage(8);
    };
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  // 세션 스토리지에서 초기값 불러오기
  useEffect(() => {
    const savedPage = sessionStorage.getItem('searchCurrentPage');
    const savedPerPage = sessionStorage.getItem('searchItemsPerPage');
    const savedSort = sessionStorage.getItem('searchSortOption');

    if (savedPage) setCurrentPage(Number(savedPage));
    if (savedPerPage) setItemsPerPage(Number(savedPerPage));
    if (savedSort === 'relevance' || savedSort === 'latest')
      setSortOption(savedSort);
  }, []);

  // API 호출 + 키워드 필터링
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);

        // Next.js API 라우트로 요청
        const params = new URLSearchParams({
          method: 'offset',
          page: '1',
          size: '50',
          keyword: keyword,
        });

        const res = await fetch(`/api/activities-list?${params.toString()}`, {
          headers: { accept: 'application/json' },
        });

        if (!res.ok) throw new Error('체험 리스트를 가져오는 데 실패했습니다.');

        const data: { activities: Activity[] } = await res.json();

        const results: Activity[] = data.activities;

        setActivities(results);
        setCurrentPage(1); // 키워드 변경 시 페이지 초기화
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError(String(err));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [keyword]);

  // 정렬 및 sessionStorage 저장
  useEffect(() => {
    sessionStorage.setItem('searchCurrentPage', currentPage.toString());
    sessionStorage.setItem('searchItemsPerPage', itemsPerPage.toString());
    sessionStorage.setItem('searchSortOption', sortOption);
  }, [currentPage, itemsPerPage, sortOption]);

  // 정렬 적용 (관련도순 | 최신순)
  const sortedResults = useMemo(() => {
    const sorted = [...activities];
    if (sortOption === 'relevance') {
      const relevanceScore = (item: Activity) => {
        let score = 0;
        const kw = keyword.toLowerCase();
        const title = item.title.toLowerCase();
        const desc = item.description?.toLowerCase() ?? '';
        if (title === kw) score += 10;
        else if (title.includes(kw)) score += 5;
        if (desc.includes(kw)) score += 2;
        return score;
      };
      sorted.sort((a, b) => relevanceScore(b) - relevanceScore(a));
    } else if (sortOption === 'latest') {
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    return sorted;
  }, [activities, sortOption, keyword]);

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
        {loading && <p className="text-center py-10">로딩 중...⏳</p>}
        {error && <p className="text-center py-10 text-red-500">{error}</p>}
        {!loading && !error && (
          <SearchResultsList
            results={sortedResults}
            keyword={keyword}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            sortOption={sortOption}
            onPageChange={setCurrentPage}
            onSortChange={setSortOption}
          />
        )}
      </div>
    </main>
  );
};

export default SearchPage;
