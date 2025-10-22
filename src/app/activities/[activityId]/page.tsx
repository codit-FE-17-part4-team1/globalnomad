'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';

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

export default function Page() {
  const params = useParams();
  const activityId = Number(params.activityId);

  if (isNaN(activityId) || activityId <= 0) {
    return <div>잘못된 체험 아이디입니다.</div>;
  }

  // numericActivityId 추가
  const numericActivityId = activityId;

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
    // 예약 가능 상태 체크
    if (!isReservationEnabled || !selectedTimeId) return;

    try {
      const res = await fetch(
        `https://sp-globalnomad-api.vercel.app/17/activities/${numericActivityId}/reservations`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // 쿠키 기반이므로 Authorization 헤더는 필요 없는듯
          },
          credentials: 'include', // 쿠키 전송 필수!
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
      } else if (res.status === 401) {
        // 로그인 안 된 상태
        alert('로그인이 필요합니다. 로그인 후 예약해주세요.');
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
          `https://sp-globalnomad-api.vercel.app/17/activities/${numericActivityId}`
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
  }, [numericActivityId]);

  // 체험 리뷰 API 호출
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `https://sp-globalnomad-api.vercel.app/17/activities/${numericActivityId}/reviews?page=1&size=3`
        );
        if (!res.ok) throw new Error('리뷰 조회 실패');
        const data: {
          reviews: Review[];
          totalCount: number;
          averageRating: number;
        } = await res.json();

        setReviews({
          reviews: data.reviews,
          totalCount: data.totalCount,
          averageRating: data.averageRating,
        });
      } catch (err) {
        console.error(err);
        setReviews({ reviews: [], totalCount: 0, averageRating: 0 });
      }
    };

    fetchReviews();
  }, [numericActivityId]);

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

        {isParticipantsModalOpen && (
          <ParticipantsModal
            onClose={() => setIsParticipantsModalOpen(false)}
            onSelectParticipants={handleSelectParticipants}
          />
        )}

        {isDateModalOpen && (
          <DateModal
            onClose={handleCloseDateModal}
            onSelectDateTime={handleUpdateDateTime}
            activityId={numericActivityId}
          />
        )}
      </section>
    </main>
  );
}
