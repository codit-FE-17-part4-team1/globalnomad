'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import MainBanner from '@/app/main/_components/MainBanner';
import SearchBar from '@/app/main/_components/SearchBar';
import SearchResultsList from './_components/SearchResultsList';
import type { Activity } from '@/types/activity';

const SearchPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  // URL에서 키워드 읽기
  const urlKeyword = searchParams.get('keyword') || '';
  const [keyword, setKeyword] = useState(urlKeyword);

  // 상태 관리
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [sortOption, setSortOption] = useState<'relevance' | 'latest'>(
    'relevance'
  );

  // URL 파라미터 변경 시 키워드 동기화
  useEffect(() => {
    const newKeyword = searchParams.get('keyword') || '';
    setKeyword(newKeyword);
  }, [searchParams]);

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

  // 검색 실행
  const handleSearch = (newKeyword: string) => {
    setKeyword(newKeyword);
    setCurrentPage(1);

    // URL 쿼리 업데이트
    router.push(`/search?keyword=${encodeURIComponent(newKeyword.trim())}`);
  };

  // API 호출
  useEffect(() => {
    const fetchActivities = async () => {
      // 키워드가 없으면 API 호출 안 함
      if (!keyword.trim()) {
        setActivities([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Next.js API 라우트로 요청
        const params = new URLSearchParams({
          method: 'cursor',
          size: '50',
          keyword: keyword.trim(),
        });

        const res = await fetch(`/api/activities-list?${params.toString()}`, {
          headers: { accept: 'application/json' },
        });

        if (!res.ok) throw new Error('체험 리스트를 가져오는 데 실패했습니다.');

        const data: { activities: Activity[] } = await res.json();

        setActivities(data.activities);
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

  const statusContainerClass =
    'w-full flex flex-col items-center justify-center h-[400px] md:h-[600px] text-lg';

  return (
    <div className="w-full flex flex-col items-center">
      {/* 배너 + 검색바 */}
      <section className="relative w-full">
        <MainBanner />
        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-2/3 z-10 w-full max-w-[1240px]">
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>
      {/* 검색 결과 리스트 */}
      <section className="w-full my-30 md:my-40">
        {loading && (
          <div className={statusContainerClass}>
            <Image
              src="/images/loading.png"
              alt="로딩 중 이미지"
              width={80}
              height={80}
            />
            <p className="text-gray-500">로딩 중...</p>
          </div>
        )}
        {error && (
          <div className={statusContainerClass + ' text-red-500'}>
            {' '}
            <p>{error}</p>
          </div>
        )}
        {!loading && !error && sortedResults.length === 0 && (
          <div className={statusContainerClass + ' text-gray-500'}>
            <Image
              src="/images/design_2/_empty.svg"
              alt="빈 페이지 이미지"
              width={80}
              height={80}
            />
            <p>검색 결과가 없습니다.</p>
          </div>
        )}

        {!loading && !error && sortedResults.length > 0 && (
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
      </section>
    </div>
  );
};

export default SearchPage;
