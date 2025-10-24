'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ActivityCard from './ActivityCard';
import Pagination from '../../../components/Pagination/Pagination';
import CategoryButtons from './CategoryButtons';
import PriceFilter from './PriceFilter';
import type { Activity } from '@/types/activity';

interface AllActivitiesProps {
  activities: Activity[]; // 이미 page.tsx에서 필터링/정렬/슬라이싱된 데이터
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  priceSort: string;
  onPriceSortChange: (sort: string) => void;
  currentPage: number;
  itemsPerPage: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  loading: boolean;
  error: string | null;
}

const AllActivities: React.FC<AllActivitiesProps> = ({
  activities,
  categories,
  selectedCategory,
  onSelectCategory,
  priceSort,
  onPriceSortChange,
  currentPage,
  itemsPerPage,
  totalCount,
  onPageChange,
  loading,
  error,
}) => {
  const router = useRouter();

  const statusContainerClass =
    'col-span-full flex items-center justify-center h-[586px] md:h-[1154px] lg:h-[897px] text-xl md:text-2xl';

  return (
    <section className="w-full max-w-[1240px] mx-auto px-5">
      {/* 카테고리 버튼 */}
      <CategoryButtons
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />

      {/* 정렬 선택 */}
      <div className="flex justify-between items-center mb-7">
        <h2 className="text-black font-bold text-2xl lg:text-[36px] leading-[100%]">
          ⛸️ 모든 체험
        </h2>
        <PriceFilter selected={priceSort} setSelected={onPriceSortChange} />
      </div>

      {/* 활동 카드 */}
      <div
        className={[
          'grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
          'justify-items-center',
          activities.length > 0 ? 'items-start' : 'items-center justify-center',
        ].join(' ')}
      >
        {loading ? (
          <div className={`${statusContainerClass} text-gray-500`}>
            로딩 중...⏳
          </div>
        ) : error ? (
          <div className={`${statusContainerClass} text-red-500`}>{error}</div>
        ) : activities.length > 0 ? (
          activities.map((exp) => (
            <ActivityCard
              key={exp.id}
              {...exp}
              type="sm"
              onClick={() => router.push(`/activities/${exp.id}`)}
            />
          ))
        ) : (
          <div
            className={`${statusContainerClass} text-gray-500 font-medium flex flex-col`}
          >
            아직 등록된 체험이 없습니다 😅
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {totalCount > 0 && (
        <div className="mt-[50px] mb-[150px]">
          <Pagination
            totalItems={totalCount}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={onPageChange}
            maxPageButtons={5}
          />
        </div>
      )}
    </section>
  );
};

export default AllActivities;
