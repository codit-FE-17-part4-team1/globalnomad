'use client';

import React from 'react';
import ActivityTitle from './_components/ActivityTitle';
import ImageGallery from './_components/ImageGallery';
import ActivityDescription from './_components/ActivityDescription';
import ActivityLocation from './_components/ActivityLocation';
import ReviewList from './_components/ReviewList';
import ActivityReservation from './_components/ActivityReservation';

import { DummyActivityData } from './data/DummyData'; // 임시 더미데이터 파일 만들어서 UI 테스트, 나중에 API 연동하면 파일 삭제 후 코드 수정
import { DummyReviewData } from './data/DummyData';

const ActivityDetailPage: React.FC = () => {
  return (
    <main className="w-full min-w-[375px] max-w-[1240px] mx-auto p-5 flex flex-col gap-5 relative">
      {/* 타이틀 섹션 */}
      <section>
        <ActivityTitle
          category={DummyActivityData.category}
          title={DummyActivityData.title}
          rating={DummyActivityData.rating}
          reviewCount={DummyActivityData.reviewCount}
          address={DummyActivityData.address}
        />
      </section>

      {/* 이미지 섹션 */}
      <section className="-mx-5 md:mx-0 md:pb-10">
        <ImageGallery
          bannerImageUrl={DummyActivityData.bannerImageUrl}
          subImages={DummyActivityData.subImages}
        />
      </section>

      <div
        className="hidden md:block border-b border-black-nomad/25 min-w-[375px] max-w-[800px]"
        id="floating-menu-anchor"
      ></div>

      {/* 체험 설명 섹션 */}
      <section className="w-full min-w-[375px] max-w-[800px] py-6">
        <ActivityDescription description={DummyActivityData.description} />
      </section>
      <div className="border-b border-black-nomad/25 min-w-[375px] max-w-[800px]"></div>

      {/* 체험 예약 섹션 (우측 플로팅 메뉴) */}
      <section className="flex justify-end">
        <ActivityReservation
          startContainerId="floating-menu-anchor"
          endContainerId="review-section"
        />
      </section>

      {/* 지도 섹션 */}
      <section className="w-full min-w-[375px] max-w-[800px] py-6">
        <ActivityLocation address={DummyActivityData.address} />
      </section>
      <div className="border-b border-black-nomad/25 min-w-[375px] max-w-[800px]"></div>

      {/* 리뷰 섹션 */}
      <section
        className="w-full min-w-[375px] max-w-[800px] pt-6 pb-80"
        id="review-section"
      >
        <ReviewList data={DummyReviewData} />
      </section>
    </main>
  );
};

export default ActivityDetailPage;
