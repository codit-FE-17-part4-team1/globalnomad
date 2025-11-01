'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import ActivityCard from './ActivityCard';
import type { Activity } from '@/types/activity';

interface PopularActivitiesProps {
  activities: Activity[];
  page: number;
  cardsPerPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isDesktop: boolean;
  loading: boolean;
  error: string | null;
}

const PopularActivities: React.FC<PopularActivitiesProps> = ({
  activities,
  page,
  cardsPerPage,
  totalPages,
  onPageChange,
  isDesktop,
  loading,
  error,
}) => {
  const router = useRouter();
  const startIndex = page * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentCards = activities.slice(startIndex, endIndex);
  const displayedCards = isDesktop ? currentCards : activities;

  const statusContainerClass =
    'w-full flex flex-col items-center justify-center h-[200px] md:h-[300px] text-lg';

  return (
    <section className="w-full max-w-[1240px] mx-auto px-5">
      <div className="flex justify-between mb-7">
        <h2 className="text-black font-bold text-2xl lg:text-[36px] leading-[100%]">
          🔥 인기 체험
        </h2>
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => page > 0 && onPageChange(page - 1)}
            disabled={page === 0}
            className={`${page === 0 ? 'cursor-not-allowed' : ''}`}
          >
            <Image
              src={
                page === 0
                  ? '/icon/btn/left_default.svg'
                  : '/icon/btn/left_variant.svg'
              }
              alt="Prev"
              width={48}
              height={48}
            />
          </button>
          <button
            onClick={() => page < totalPages - 1 && onPageChange(page + 1)}
            disabled={page >= totalPages - 1}
            className={`${page >= totalPages - 1 ? 'cursor-not-allowed' : ''}`}
          >
            <Image
              src={
                page >= totalPages - 1
                  ? '/icon/btn/right_default.svg'
                  : '/icon/btn/right_variant.svg'
              }
              alt="Next"
              width={48}
              height={48}
            />
          </button>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-4 scrollbar-hide lg:flex-nowrap lg:overflow-hidden lg:justify-start">
        {loading ? (
          <div className={statusContainerClass}>
            <Image
              src="/images/loading.png"
              alt="로딩 중 이미지"
              width={100}
              height={100}
            />
            <p className="text-gray-700">로딩 중...</p>
          </div>
        ) : error ? (
          <div className={statusContainerClass + ' text-red-500'}>{error}</div>
        ) : displayedCards.length === 0 ? (
          <div className={statusContainerClass}>
            <Image
              src="/images/design_2/_empty.svg"
              alt="빈 페이지 이미지"
              width={80}
              height={80}
            />
            <p className="text-gray-500">아직 등록된 체험이 없습니다.</p>
          </div>
        ) : (
          displayedCards.map((exp) => (
            <div key={exp.id} className="flex-shrink-0">
              <ActivityCard
                {...exp}
                type="lg"
                onClick={() => router.push(`/activities/${exp.id}`)}
              />
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default PopularActivities;
