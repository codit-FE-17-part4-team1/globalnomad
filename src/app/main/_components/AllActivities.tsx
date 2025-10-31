'use client';

import React from 'react';
import Image from 'next/image';
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
    'col-span-full flex items-center justify-center h-[400px] md:h-[600px] lg:h-[600px] text-lg';

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
      {loading ? ( // 로딩 화면
        <div
          className={`${statusContainerClass} flex flex-col items-center justify-center`}
        >
          <Image
            src="/images/loading.png"
            alt="로딩 중 이미지"
            width={80}
            height={80}
          />
          <p className="text-gray-500">로딩 중...</p>
        </div>
      ) : error ? ( // 에러
        <div
          className={`${statusContainerClass} text-red-500 flex items-center justify-center`}
        >
          {error}
        </div>
      ) : activities.length === 0 ? ( // 빈페이지
        <div
          className={`${statusContainerClass} flex flex-col items-center justify-center`}
        >
          <Image
            src="/images/design_2/_empty.svg"
            alt="빈 페이지 이미지"
            width={80}
            height={80}
          />
          <p className="text-gray-500">아직 등록된 체험이 없습니다.</p>
        </div>
      ) : (
        // 카드 랜더링
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center items-start">
          {activities.map((exp) => (
            <ActivityCard
              key={exp.id}
              {...exp}
              type="sm"
              onClick={() => router.push(`/activities/${exp.id}`)}
            />
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {activities.length > 0 && totalCount > 0 && (
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
