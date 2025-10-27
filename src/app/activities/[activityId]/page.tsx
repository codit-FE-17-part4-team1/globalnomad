import React from 'react';
import dayjs from 'dayjs';

import ActivityTitle from '../_components/ActivityDetaiInfo/ActivityTitle';
import ImageGallery from '../_components/ActivityDetaiInfo/ImageGallery';
import ActivityDescription from '../_components/ActivityDetaiInfo/ActivityDescription';
import ActivityLocation from '../_components/ActivityDetaiInfo/ActivityLocation';
import ReviewList from '../_components/ActivityDetaiInfo/ReviewList';

import ActivityReservation from '../_components/ActivityReservation/ActivityReservation';

import type { ActivityDetailInfo, AvailableSchedule } from '@/types/activity';
import type { Reviews } from '@/types/review';

interface PageProps {
  params: Promise<{ activityId: string }>;
}

// 서버에서 체험 상세 조회 데이터 fetch
async function fetchActivity(activityId: number): Promise<ActivityDetailInfo> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/activities/${activityId}`
  );
  if (!res.ok) throw new Error('체험 상세 조회 실패');
  return res.json();
}

// 서버에서 리뷰 데이터 fetch
async function fetchReviews(activityId: number): Promise<Reviews> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/activities/${activityId}/reviews?page=1&size=3`
  );
  if (!res.ok) return { reviews: [], totalCount: 0, averageRating: 0 };
  return res.json();
}

// 서버에서 예약 가능한 날짜 데이터 fetch
async function fetchAvailableDates(
  activityId: number
): Promise<AvailableSchedule[]> {
  const today = dayjs();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/activities/${activityId}/available-schedule?year=${today.year()}&month=${String(
      today.month() + 1
    ).padStart(2, '0')}`
  );
  if (!res.ok) return [];
  return res.json();
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const activityId = Number(resolvedParams.activityId);

  if (isNaN(activityId) || activityId <= 0) {
    return <div>잘못된 체험 아이디입니다.</div>;
  }

  const [activity, reviews, scheduleData] = await Promise.all([
    fetchActivity(activityId),
    fetchReviews(activityId),
    fetchAvailableDates(activityId),
  ]);

  return (
    <div className="w-full min-w-[375px] max-w-[1240px] mx-auto p-5 flex flex-col gap-5">
      {/* 타이틀 섹션 */}
      <section>
        <ActivityTitle
          id={activity.id}
          category={activity.category}
          title={activity.title}
          rating={activity.rating}
          reviewCount={activity.reviewCount}
          address={activity.address}
        />
      </section>

      {/* 이미지 섹션 */}
      <section className="-mx-5 md:mx-0 md:pb-10">
        <ImageGallery
          bannerImageUrl={activity.bannerImageUrl}
          subImages={activity.subImages}
        />
      </section>

      <div className="flex flex-col md:flex-row gap-x-6 w-full">
        {/* 왼쪽 컬럼 */}
        <div className="flex flex-col gap-5 flex-1 md:max-w-[800px]">
          <div className="hidden md:block border-b border-black-nomad/25"></div>
          <section className="w-full py-6">
            <ActivityDescription description={activity.description} />
          </section>
          <div className="border-b border-black-nomad/25 -mx-5 md:mx-0"></div>
          <section className="w-full py-6">
            <ActivityLocation address={activity.address} />
          </section>
          <div className="border-b border-black-nomad/25 -mx-5 md:mx-0"></div>
          <section className="w-full pt-6 pb-80">
            <ReviewList data={reviews} />
          </section>
        </div>

        {/* 오른쪽 컬럼: 체험 예약 (클라이언트 컴포넌트) */}
        <ActivityReservation activity={activity} scheduleData={scheduleData} />
      </div>
    </div>
  );
}
