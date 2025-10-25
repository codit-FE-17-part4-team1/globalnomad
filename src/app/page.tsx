'use client';

import React, { useState, useEffect } from 'react';
import MainBanner from './main/_components/MainBanner';
import SearchBar from './main/_components/SearchBar';
import PopularActivities from './main/_components/PopularActivities';
import AllActivities from './main/_components/AllActivities';
import type { Activity } from '@/types/activity';

const SectionContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <section className={`w-full flex justify-center ${className}`}>
    <div className="w-full min-w-[375px] max-w-[1240px]">{children}</div>
  </section>
);

const MainPage: React.FC = () => {
  // 공통 상태
  const categories = [
    '전체',
    '문화·예술',
    '식음료',
    '스포츠',
    '투어',
    '관광',
    '웰빙',
  ];
  const [activities, setActivities] = useState<Activity[]>([]);
  const [popularActivities, setPopularActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // AllActivities 상태
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [priceSort, setPriceSort] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [totalCount, setTotalCount] = useState(0);
  const [visibleActivities, setVisibleActivities] = useState<Activity[]>([]);

  // PopularActivities 상태
  const [popularPage, setPopularPage] = useState(0);
  const cardsPerPage = 3;
  const [isDesktop, setIsDesktop] = useState(false);

  // 화면 크기 체크 + itemsPerPage
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
      if (window.innerWidth < 768) setItemsPerPage(4);
      else if (window.innerWidth < 1024) setItemsPerPage(9);
      else setItemsPerPage(8);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // localStorage에서 초기 상태 로드
  useEffect(() => {
    const savedCategory = localStorage.getItem('selectedCategory');
    const savedPage = localStorage.getItem('allActivitiesPage');
    const savedItemsPerPage = localStorage.getItem('itemsPerPage');
    const savedPriceSort = localStorage.getItem('priceSort');

    if (savedCategory) setSelectedCategory(savedCategory);
    if (savedPage) setCurrentPage(Number(savedPage));
    if (savedItemsPerPage) setItemsPerPage(Number(savedItemsPerPage));
    if (savedPriceSort) setPriceSort(savedPriceSort);
  }, []);

  // API 호출
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          method: 'cursor',
          size: '50',
        });

        const res = await fetch(
          `https://sp-globalnomad-api.vercel.app/17-1/activities?${params}`,
          { headers: { accept: 'application/json' } }
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        setActivities(data.activities);
        setTotalCount(data.totalCount ?? data.activities.length);

        // 인기 체험
        const sortedPopular = [...data.activities].sort((a, b) =>
          b.rating === a.rating
            ? b.reviewCount - a.reviewCount
            : b.rating - a.rating
        );
        setPopularActivities(sortedPopular.slice(0, 9));
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // 필터링 + 정렬 + 페이지네이션
  useEffect(() => {
    if (!activities) return;

    const filtered =
      selectedCategory === '전체'
        ? [...activities]
        : activities.filter((act) => act.category === selectedCategory);

    if (priceSort === '가격 낮은 순')
      filtered.sort((a, b) => a.price - b.price);
    else if (priceSort === '가격 높은 순')
      filtered.sort((a, b) => b.price - a.price);
    else
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    setTotalCount(filtered.length);

    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    setVisibleActivities(filtered.slice(startIdx, endIdx));

    // localStorage 동기화
    localStorage.setItem('selectedCategory', selectedCategory);
    localStorage.setItem('priceSort', priceSort);
    localStorage.setItem('allActivitiesPage', currentPage.toString());
    localStorage.setItem('itemsPerPage', itemsPerPage.toString());
  }, [activities, selectedCategory, priceSort, currentPage, itemsPerPage]);

  return (
    <main className="w-full flex flex-col items-center">
      <div className="relative w-full">
        <MainBanner />
        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-2/3 z-10 w-full max-w-[1240px]">
          <SearchBar />
        </div>
      </div>

      {/* 인기 체험 영역 */}
      <SectionContainer className="mt-30 md:mt-40">
        <PopularActivities
          activities={popularActivities}
          page={popularPage}
          cardsPerPage={cardsPerPage}
          totalPages={Math.ceil(popularActivities.length / cardsPerPage)}
          onPageChange={setPopularPage}
          isDesktop={isDesktop}
          loading={loading}
          error={error}
        />
      </SectionContainer>

      {/* 모든 체험 영역 */}
      <SectionContainer className="my-20">
        <AllActivities
          activities={visibleActivities} // 이미 필터링/정렬/페이지네이션 적용
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          priceSort={priceSort}
          onPriceSortChange={setPriceSort}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalCount={totalCount}
          onPageChange={setCurrentPage}
          loading={loading}
          error={error}
        />
      </SectionContainer>
    </main>
  );
};

export default MainPage;
