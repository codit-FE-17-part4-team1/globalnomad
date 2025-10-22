'use client';

import React, { useState, useEffect, useMemo } from 'react';
import ActivityTitle from '../_components/ActivityDetaiInfo/ActivityTitle';
import ImageGallery from '../_components/ActivityDetaiInfo/ImageGallery';
import ActivityDescription from '../_components/ActivityDetaiInfo/ActivityDescription';
import ActivityLocation from '../_components/ActivityDetaiInfo/ActivityLocation';
import ReviewList from '../_components/ActivityDetaiInfo/ReviewList';

import ReservationSidebar from '../_components/ActivityReservation/ReservationContainer/ReservationSidebar';
import ReservationStickyFooter from '../_components/ActivityReservation/ReservationContainer/ReservationStickyFooter';
import ParticipantsModal from '../_components/ActivityReservation/ReservationContainer/ParticipantsModal';
import DateModal from '../_components/ActivityReservation/ReservationContainer/DateModal';

import type { ActivityDetailInfo } from '@/types/activity';
import type { Reviews, Review } from '@/types/review';

interface ActivityDetailPageProps {
  activityId: number;
}

const ActivityDetailPage: React.FC<ActivityDetailPageProps> = ({
  activityId,
}) => {
  const [activity, setActivity] = useState<ActivityDetailInfo | null>(null);
  const [reviews, setReviews] = useState<Reviews>({
    reviews: [],
    totalCount: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 날짜 모달 상태
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);

  // 선택된 날짜/시간 정보
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeId, setSelectedTimeId] = useState<number | null>(null);
  const [selectedDateTimeText, setSelectedDateTimeText] =
    useState<string>('날짜 선택하기');

  // 참가자 모달 상태
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [participants, setParticipants] = useState<number>(1);

  // 예약 버튼 활성화 상태 계산
  const isReservationEnabled = useMemo(() => {
    return selectedDate !== null && selectedTimeId !== null && participants > 0;
  }, [selectedDate, selectedTimeId, participants]);

  // 날짜 모달 열기/닫기
  const handleOpenDateModal = () => setIsDateModalOpen(true);
  const handleCloseDateModal = () => setIsDateModalOpen(false);

  // 날짜/시간 선택 시 호출 - timeId도 함께 받음
  const handleUpdateDateTime = (formattedText: string, timeId: number) => {
    setSelectedDateTimeText(formattedText);
    setSelectedTimeId(timeId);
    setSelectedDate(formattedText.split(' ')[0].replace(/\//g, '-'));
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
  const handleReserve = async () => {
    if (!isReservationEnabled || !selectedTimeId) return;

    try {
      const res = await fetch(
        `https://sp-globalnomad-api.vercel.app/17/activities/${activityId}/reservations`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            scheduleId: selectedTimeId,
            headCount: participants,
          }),
        }
      );

      if (res.status === 201) {
        const data = await res.json();
        console.log('예약 완료:', data);
        alert('예약이 완료되었습니다!');
        // 예약 완료 후 필요한 후처리 (예: 모달 닫기, 초기화 등)
      } else {
        const errorData = await res.json();
        console.error('예약 실패:', errorData);
        alert(`예약 실패: ${errorData.message || '알 수 없는 오류'}`);
      }
    } catch (err) {
      console.error(err);
      alert('예약 중 오류가 발생했습니다.');
    }
  };

  // 체험 상세 API 호출
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://sp-globalnomad-api.vercel.app/17/activities/${activityId}`
        );
        if (!res.ok) {
          throw new Error('체험 상세 조회 실패');
        }
        const data = await res.json();
        setActivity(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || '알 수 없는 오류');
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [activityId]);

  // 체험 리뷰 API 호출
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `https://sp-globalnomad-api.vercel.app/17/activities/${activityId}/reviews?page=1&size=3`
        );
        if (!res.ok) throw new Error('리뷰 조회 실패');
        const data: {
          reviews: Review[];
          totalCount: number;
          averageRating: number;
        } = await res.json();

        // ReviewList 컴포넌트가 기대하는 형태로 전달
        setReviews({
          reviews: data.reviews,
          totalCount: data.totalCount,
          averageRating: data.averageRating,
        });
      } catch (err) {
        console.error(err);
        // 빈 상태 전달
        setReviews({ reviews: [], totalCount: 0, averageRating: 0 });
      }
    };

    fetchReviews();
  }, [activityId]);

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>에러 발생: {error}</div>;
  if (!activity) return <div>체험 정보를 찾을 수 없습니다.</div>;

  return (
    <main className="w-full min-w-[375px] max-w-[1240px] mx-auto p-5 flex flex-col gap-5">
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
        {/* 왼쪽 컬럼: 체험 설명, 지도, 리뷰 */}
        <div className="flex flex-col gap-5 flex-1 md:max-w-[800px]">
          <div className="hidden md:block border-b border-black-nomad/25"></div>

          {/* 체험 설명 섹션 */}
          <section className="w-full py-6">
            <ActivityDescription description={activity.description} />
          </section>

          <div className="border-b border-black-nomad/25 -mx-5 md:mx-0"></div>

          {/* 지도 섹션 */}
          <section className="w-full py-6">
            <ActivityLocation address={activity.address} />
          </section>

          <div className="border-b border-black-nomad/25 -mx-5 md:mx-0"></div>

          {/* 리뷰 섹션 */}
          <section className="w-full pt-6 pb-80">
            <ReviewList data={reviews} />
          </section>
        </div>

        {/* 오른쪽 컬럼: 사이드바 */}
        <div className="hidden md:flex md:flex-col md:w-[300px] lg:w-[400px]">
          <ReservationSidebar
            activity={activity}
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
            activityId={activityId}
          />
        )}
      </section>
    </main>
  );
};

export default ActivityDetailPage;
