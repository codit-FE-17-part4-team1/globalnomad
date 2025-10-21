'use client';

import React, { useState, useMemo } from 'react';
import ActivityTitle from './_components/ActivityDetaiInfo/ActivityTitle';
import ImageGallery from './_components/ActivityDetaiInfo/ImageGallery';
import ActivityDescription from './_components/ActivityDetaiInfo/ActivityDescription';
import ActivityLocation from './_components/ActivityDetaiInfo/ActivityLocation';
import ReviewList from './_components/ActivityDetaiInfo/ReviewList';

import ReservationSidebar from './_components/ActivityReservation/ReservationContainer/ReservationSidebar';
import ReservationStickyFooter from './_components/ActivityReservation/ReservationContainer/ReservationStickyFooter';
import ParticipantsModal from './_components/ActivityReservation/ReservationContainer/ParticipantsModal';
import DateModal from './_components/ActivityReservation/ReservationContainer/DateModal';

import { DummyActivityData, DummyReviewData } from './data/DummyData';

const ActivityDetailPage: React.FC = () => {
  // 날짜 모달 상태
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);

  // 선택된 날짜/시간 정보
  const [selectedDateTimeText, setSelectedDateTimeText] =
    useState<string>('날짜 선택하기');
  const [selectedTimeId, setSelectedTimeId] = useState<number | null>(null);

  // 참가자 모달 상태
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [participants, setParticipants] = useState<number>(1);

  // 예약 버튼 활성화 상태 계산
  const isReservationEnabled = useMemo(() => {
    return (
      selectedDateTimeText !== '날짜 선택하기' &&
      selectedTimeId !== null &&
      participants > 0
    );
  }, [selectedDateTimeText, selectedTimeId, participants]);

  // 날짜 모달 열기/닫기
  const handleOpenDateModal = () => setIsDateModalOpen(true);
  const handleCloseDateModal = () => setIsDateModalOpen(false);

  // 날짜/시간 선택 시 호출 - timeId도 함께 받음
  const handleUpdateDateTime = (formattedText: string, timeId: number) => {
    setSelectedDateTimeText(formattedText);
    setSelectedTimeId(timeId);
    setIsDateModalOpen(false);
  };

  // 참가자 모달 열기
  const handleOpenParticipantsModal = () => setIsParticipantsModalOpen(true);

  // 참가자 선택
  const handleSelectParticipants = (num: number) => {
    setParticipants(num);
    setIsParticipantsModalOpen(false);
  };

  // 예약하기 핸들러
  const handleReserve = () => {
    if (!isReservationEnabled) return;
    console.log('예약하기:', {
      selectedDateTimeText,
      selectedTimeId,
      participants,
    });
    // 실제 예약 로직 구현
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

          <div className="border-b border-black-nomad/25 -mx-5 md:mx-0"></div>

          {/* 지도 섹션 */}
          <section className="w-full py-6">
            <ActivityLocation address={DummyActivityData.address} />
          </section>

          <div className="border-b border-black-nomad/25 -mx-5 md:mx-0"></div>

          {/* 리뷰 섹션 */}
          <section className="w-full pt-6 pb-80">
            <ReviewList data={DummyReviewData} />
          </section>
        </div>

        {/* 오른쪽 컬럼: 사이드바 */}
        <div className="hidden md:flex md:flex-col md:w-[300px] lg:w-[400px]">
          <ReservationSidebar
            activity={DummyActivityData}
            teamId="#17"
            onOpenDateModal={handleOpenDateModal}
            selectedDateText={selectedDateTimeText}
          />
        </div>
      </div>

      {/* 스티키 푸터 */}
      <section>
        <ReservationStickyFooter
          onOpenParticipantsModal={handleOpenParticipantsModal}
          onOpenDateModal={handleOpenDateModal}
          selectedDateText={selectedDateTimeText}
          selectedTimeId={selectedTimeId}
          participants={participants}
          isReservationEnabled={isReservationEnabled}
          onReserve={handleReserve}
        />

        {/* 참여 인원 선택 모달 */}
        {isParticipantsModalOpen && (
          <ParticipantsModal
            onClose={() => setIsParticipantsModalOpen(false)}
            onSelectParticipants={handleSelectParticipants}
          />
        )}

        {/* 날짜 선택 모달 */}
        {isDateModalOpen && (
          <DateModal
            onClose={handleCloseDateModal}
            onSelectDateTime={handleUpdateDateTime}
          />
        )}
      </section>
    </main>
  );
};

export default ActivityDetailPage;
