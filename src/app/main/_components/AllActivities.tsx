'use client';

import React, { useState, useEffect } from 'react';
import ActivityCard from './ActivityCard';
import Pagination from '../../../components/Pagination/Pagination';
import CategoryButtons from './CategoryButtons';
import PriceFilter from './PriceFilter';
import type { Activity } from '@/types/activity';

import { DummyActivities } from '../data/DummyData'; // 임시 더미데이터 파일 만들어서 UI 테스트, 나중에 API 연동하면 파일 삭제 후 코드 수정

const categories = [
  '전체',
  '문화·예술',
  '식음료',
  '스포츠',
  '투어',
  '관광',
  '웰빙',
];

const AllActivities: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [visibleCards, setVisibleCards] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] =
    useState<Activity[]>(DummyActivities);
  const [priceSort, setPriceSort] = useState('');

  // 화면 크기에 따라 itemsPerPage 조정
  const updateItemsPerPage = () => {
    if (window.innerWidth < 768) setItemsPerPage(4);
    else if (window.innerWidth < 1024) setItemsPerPage(9);
    else setItemsPerPage(8);
  };

  useEffect(() => {
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  // localStorage 에서 초기 상태 로드
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

  // 카테고리 및 가격 정렬 처리
  useEffect(() => {
    const filtered =
      selectedCategory === '전체'
        ? [...DummyActivities]
        : DummyActivities.filter((exp) => exp.category === selectedCategory);

    if (priceSort === '가격 낮은 순')
      filtered.sort((a, b) => a.price - b.price);
    else if (priceSort === '가격 높은 순')
      filtered.sort((a, b) => b.price - a.price);
    else
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    setFilteredActivities(filtered);
    setCurrentPage(1);
    localStorage.setItem('selectedCategory', selectedCategory);
    localStorage.setItem('priceSort', priceSort);
  }, [selectedCategory, priceSort]);

  // 페이지네이션 로직 적용
  useEffect(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    setVisibleCards(filteredActivities.slice(startIdx, endIdx));

    localStorage.setItem('allActivitiesPage', currentPage.toString());
    localStorage.setItem('itemsPerPage', itemsPerPage.toString());
  }, [currentPage, itemsPerPage, filteredActivities]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredActivities.length / itemsPerPage)
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <section className="w-full max-w-[1240px] mx-auto px-5">
      {/* 카테고리 버튼 */}
      <CategoryButtons
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className="flex justify-between items-center mb-7">
        <h2 className="text-black font-bold text-2xl lg:text-[36px] leading-[100%]">
          ⛸️ 모든 체험
        </h2>

        {/* 가격 정렬 필터 */}
        <PriceFilter selected={priceSort} setSelected={setPriceSort} />
      </div>

      {/* 카드 리스트 */}
      <div
        className={[
          'grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
          'h-[586px] md:h-[1154px] lg:h-[897px]',
          'justify-items-center',
          visibleCards.length > 0
            ? 'items-start'
            : 'items-center justify-center',
        ].join(' ')}
      >
        {visibleCards.length > 0 ? (
          visibleCards.map((exp) => (
            <ActivityCard key={exp.id} {...exp} type="sm" />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center text-gray-500 text-xl md:text-2xl font-medium">
            아직 등록된 체험이 없습니다😅
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {filteredActivities.length > 0 && (
        <div className="mt-[50px] mb-[150px]">
          <Pagination
            totalItems={filteredActivities.length}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            maxPageButtons={5}
          />
        </div>
      )}
    </section>
  );
};

export default AllActivities;
