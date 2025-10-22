'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ActivityCard from './ActivityCard';
import Pagination from '../../../components/Pagination/Pagination';
import CategoryButtons from './CategoryButtons';
import PriceFilter from './PriceFilter';
import type { Activity } from '@/types/activity';

interface AllActivitiesProps {
  activities: Activity[];
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
  const filtered = activities
    .filter(
      (a) => selectedCategory === '전체' || a.category === selectedCategory
    )
    .sort((a, b) => {
      if (priceSort === '가격 낮은 순') return a.price - b.price;
      if (priceSort === '가격 높은 순') return b.price - a.price;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const statusContainerClass =
    'col-span-full flex items-center justify-center h-[586px] md:h-[1154px] lg:h-[897px] text-xl md:text-2xl';

  return (
    <section className="w-full max-w-[1240px] mx-auto px-5">
      <CategoryButtons
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />
      <div className="flex justify-between items-center mb-7">
        <h2 className="text-black font-bold text-2xl lg:text-[36px] leading-[100%]">
          ⛸️ 모든 체험
        </h2>
        <PriceFilter selected={priceSort} setSelected={onPriceSortChange} />
      </div>

      <div
        className={[
          'grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
          'justify-items-center',
          filtered.length > 0 ? 'items-start' : 'items-center justify-center',
        ].join(' ')}
      >
        {loading ? (
          <div className={`${statusContainerClass} text-gray-500`}>
            로딩 중...⏳
          </div>
        ) : error ? (
          <div className={`${statusContainerClass} text-red-500`}>{error}</div>
        ) : filtered.length > 0 ? (
          filtered.map((exp) => (
            <ActivityCard
              key={exp.id}
              {...exp}
              type="sm"
              onClick={() => router.push(`/activity/${exp.id}`)}
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
