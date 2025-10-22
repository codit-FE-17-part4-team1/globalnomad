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

  if (loading) return <p className="text-center py-10">로딩 중...⏳</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

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

      <div className="flex overflow-x-auto gap-4 flex-nowrap lg:overflow-hidden scrollbar-hide lg:justify-start">
        {displayedCards.map((exp) => (
          <ActivityCard
            key={exp.id}
            {...exp}
            type="lg"
            onClick={() => router.push(`/activities/${exp.id}`)}
          />
        ))}
      </div>
    </section>
  );
};

export default PopularActivities;
