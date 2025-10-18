'use client';

import React, { useState, useRef } from 'react';
import ActivityTitle from './_components/ActivityDetaiInfo/ActivityTitle';
import ImageGallery from './_components/ActivityDetaiInfo/ImageGallery';
import ActivityDescription from './_components/ActivityDetaiInfo/ActivityDescription';
import ActivityLocation from './_components/ActivityDetaiInfo/ActivityLocation';
import ReviewList from './_components/ActivityDetaiInfo/ReviewList';

import ReservationSidebar from './_components/ActivityReservation/ReservationContainer_PC/ReservationSidebar';
import ReservationModal from './_components/ActivityReservation/ReservationContainer_Tablet/ReservationModal';
import ReservationStickyFooter from './_components/ActivityReservation/ReservationContainer_Mobile/ReservationStickyFooter';

import { DummyActivityData } from './data/DummyData';
import { DummyReviewData } from './data/DummyData';

const ActivityDetailPage: React.FC = () => {
  // 모달 오픈
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);

  // 버튼 텍스트
  const [selectedDateTimeText, setSelectedDateTimeText] =
    useState<string>('날짜 선택하기');

  // 모달에서 날짜/시간 선택 시 호출됨
  const handleUpdateDateTime = (formattedText: string) => {
    setSelectedDateTimeText(formattedText);
    setIsDateModalOpen(false); // 선택 후 모달 닫기
  };

  return (
    <main className="w-full min-w-[375px] max-w-[1240px] mx-auto p-5 flex flex-col gap-5">
      {/* 타이틀 섹션 */}
      <section>
        <ActivityTitle
          id={DummyActivityData.id}
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
      <div className="flex flex-col md:flex-row gap-x-6 w-full">
        {/* 왼쪽 컬럼: 체험 설명, 지도, 리뷰 */}
        <div className="flex flex-col gap-5 flex-1 md:max-w-[800px]">
          <div className="hidden md:block border-b border-black-nomad/25"></div>
          {/* 체험 설명 섹션 */}
          <section className="w-full py-6">
            <ActivityDescription description={DummyActivityData.description} />
          </section>

          <div className="border-b border-black-nomad/25"></div>

          {/* 지도 섹션 */}
          <section className="w-full py-6">
            <ActivityLocation address={DummyActivityData.address} />
          </section>

          <div className="border-b border-black-nomad/25"></div>

          {/* 리뷰 섹션 */}
          <section className="w-full pt-6 pb-80">
            <ReviewList data={DummyReviewData} />
          </section>
        </div>

        {/* 오른쪽 컬럼: 플로팅 메뉴 */}
        <div className="hidden md:flex md:flex-col md:flex-[0_1_400px] md:min-w-[250px] lg:flex-[0_0_400px] relative ">
          {!isDateModalOpen ? (
            <ReservationSidebar
              activity={DummyActivityData}
              teamId="#17"
              onOpenDateModal={() => setIsDateModalOpen(true)}
              selectedDateText={selectedDateTimeText}
            />
          ) : (
            <div className="absolute top-0 right-0 z-50">
              <ReservationModal
                onClose={() => setIsDateModalOpen(false)}
                onSelectDateTime={handleUpdateDateTime}
              />
            </div>
          )}
        </div>
      </div>
      {/* 스티키 푸터 */}
      <section>
        <ReservationStickyFooter />
      </section>
    </main>
  );
};

export default ActivityDetailPage;
