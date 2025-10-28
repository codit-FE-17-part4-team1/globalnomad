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
  const [visibleActivities, setVisibleActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [priceSort, setPriceSort] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [totalCount, setTotalCount] = useState(0);

  const [popularPage, setPopularPage] = useState(0);
  const cardsPerPage = 3;
  const [isDesktop, setIsDesktop] = useState(false);

  // 화면 크기 체크
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

  // 체험 리스트 API 호출
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `/api/activities-list?method=cursor&page=1&size=100`
        );
        if (!res.ok) throw new Error('체험 목록 조회 실패');

        const data = await res.json();
        const activitiesArray = Array.isArray(data.activities)
          ? data.activities
          : [];
        setActivities(activitiesArray);

        // 인기 체험 정렬 로직
        const sortedPopular = [...activitiesArray]
          .sort((a, b) =>
            b.rating === a.rating
              ? b.reviewCount - a.reviewCount
              : b.rating - a.rating
          )
          .slice(0, 9);
        setPopularActivities(sortedPopular);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError(String(err));
        setActivities([]);
        setPopularActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // 필터링 + 정렬 + 페이지네이션
  useEffect(() => {
    if (!activities?.length) return;

    const filtered: Activity[] =
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

    // 페이지네이션 로직
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    setVisibleActivities(filtered.slice(startIdx, endIdx));

    // localStorage 동기화
    localStorage.setItem('selectedCategory', selectedCategory);
    localStorage.setItem('priceSort', priceSort);
    localStorage.setItem('allActivitiesPage', currentPage.toString());
    localStorage.setItem('itemsPerPage', itemsPerPage.toString());
  }, [activities, selectedCategory, priceSort, currentPage, itemsPerPage]);

  // 필터나 정렬이 바뀌면 페이지를 1로 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, priceSort]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full">
        <MainBanner />
        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-2/3 z-10 w-full max-w-[1240px]">
          <SearchBar />
        </div>
      </div>

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

      <SectionContainer className="my-20">
        <AllActivities
          activities={visibleActivities}
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
    </div>
  );
};

export default MainPage;
