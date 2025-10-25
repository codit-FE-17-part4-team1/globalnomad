'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import dayjs from 'dayjs';

import ActivityTitle from '../_components/ActivityDetaiInfo/ActivityTitle';
import ImageGallery from '../_components/ActivityDetaiInfo/ImageGallery';
import ActivityDescription from '../_components/ActivityDetaiInfo/ActivityDescription';
import ActivityLocation from '../_components/ActivityDetaiInfo/ActivityLocation';
import ReviewList from '../_components/ActivityDetaiInfo/ReviewList';

import ReservationSidebar from '../_components/ActivityReservation/ReservationContainer/ReservationSidebar';
import ReservationStickyFooter from '../_components/ActivityReservation/ReservationContainer/ReservationStickyFooter';
import ParticipantsModal from '../_components/ActivityReservation/ReservationContainer/ParticipantsModal';
import DateModal from '../_components/ActivityReservation/ReservationContainer/DateModal';

import type {
  ActivityDetailInfo,
  AvailableSchedule,
  AvailableTime,
} from '@/types/activity';
import type { Reviews, Review } from '@/types/review';

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const activityId = Number(params.activityId);

  if (isNaN(activityId) || activityId <= 0) {
    return <div>잘못된 체험 아이디입니다.</div>;
  }

  const numericActivityId = activityId;

  const [activity, setActivity] = useState<ActivityDetailInfo | null>(null);
  const [reviews, setReviews] = useState<Reviews>({
    reviews: [],
    totalCount: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 날짜/시간, 참가자 상태
  const [scheduleData, setScheduleData] = useState<AvailableSchedule[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<AvailableTime[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeId, setSelectedTimeId] = useState<number | null>(null);
  const [selectedDateTimeText, setSelectedDateTimeText] =
    useState('날짜 선택하기');
  const [participants, setParticipants] = useState<number>(1);

  // 모달 상태
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);

  // 예약 버튼 활성화
  const isReservationEnabled = useMemo(() => {
    return selectedDate !== null && selectedTimeId !== null && participants > 0;
  }, [selectedDate, selectedTimeId, participants]);

  // 날짜 모달 열기/닫기
  const handleOpenDateModal = () => setIsDateModalOpen(true);
  const handleCloseDateModal = () => setIsDateModalOpen(false);

  // 날짜/시간 선택 시 호출
  const handleUpdateDateTime = (formattedText: string, timeId: number) => {
    setSelectedDateTimeText(formattedText);
    setSelectedTimeId(timeId);
    setSelectedDate(formattedText.split(' ')[0].replace(/\//g, '-'));
    setIsDateModalOpen(false);
  };

  // 참가자 모달 열기/선택
  const handleOpenParticipantsModal = () => setIsParticipantsModalOpen(true);
  const handleSelectParticipants = (num: number) => {
    setParticipants(num);
    setIsParticipantsModalOpen(false);
  };

  // 예약 API
  async function reserveActivity({
    activityId,
    scheduleId,
    headCount,
  }: {
    activityId: number;
    scheduleId: number;
    headCount: number;
  }) {
    try {
      const res = await fetch(
        `/api/proxy/17-1/activities/${activityId}/reservations`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scheduleId, headCount }),
          credentials: 'include',
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, error: errorData.message || '예약 실패' };
      }
      const data = await res.json();
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message || '알 수 없는 오류' };
    }
  }

  const handleReserve = async () => {
    if (!isReservationEnabled || !selectedTimeId) return;

    const result = await reserveActivity({
      activityId: numericActivityId,
      scheduleId: selectedTimeId,
      headCount: participants,
    });

    console.log('예약 API 결과:', result);

    if (result.success) {
      const goToMain = window.confirm(
        '예약이 완료되었습니다. 메인 화면으로 이동하시겠습니까?'
      );
      if (goToMain) router.push('/');
      else window.location.reload();
    } else {
      alert(result.error);
    }
  };

  // 월별 예약 가능한 날짜 조회 함수
  const fetchAvailableDatesForMonth = useCallback(
    async (year: number, month: number) => {
      console.log('🔍 fetchAvailableDatesForMonth 호출:', year, month);
      try {
        const res = await fetch(
          `https://sp-globalnomad-api.vercel.app/17-1/activities/${numericActivityId}/available-schedule?year=${year}&month=${String(
            month
          ).padStart(2, '0')}`
        );
        if (!res.ok) throw new Error('예약 가능 일정 조회 실패');

        const data: AvailableSchedule[] = await res.json();
        console.log('✅ 받은 데이터:', data);

        // 전체 데이터 저장 (날짜 + 시간 정보 모두)
        setScheduleData(data);

        // 날짜만 추출하여 저장
        const dates = data.map((d) => d.date);
        setAvailableDates(dates);
        console.log('✅ 설정된 날짜들:', dates);
      } catch (err) {
        console.error('❌ 에러 발생:', err);
        setScheduleData([]);
        setAvailableDates([]);
        setAvailableTimes([]);
      }
    },
    [numericActivityId]
  );

  // 체험 상세 API
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://sp-globalnomad-api.vercel.app/17-1/activities/${numericActivityId}`
        );
        if (!res.ok) throw new Error('체험 상세 조회 실패');
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

  // 체험 리뷰 API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `https://sp-globalnomad-api.vercel.app/17-1/activities/${numericActivityId}/reviews?page=1&size=3`
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

  // 1. 초기 로드 시 현재 월 데이터 fetch
  useEffect(() => {
    const today = dayjs();
    const year = today.year();
    const month = today.month() + 1;

    fetchAvailableDatesForMonth(year, month);
  }, [fetchAvailableDatesForMonth]);

  // 2. 선택된 날짜가 바뀔 때 저장된 데이터에서 시간 추출 (API 재호출 최소화)
  useEffect(() => {
    if (!selectedDate) {
      setAvailableTimes([]);
      setSelectedTimeId(null);
      setSelectedDateTimeText('날짜 선택하기');
      return;
    }

    // 이미 fetch한 scheduleData에서 찾아보자
    const daySchedule = scheduleData.find((d) => d.date === selectedDate);

    if (daySchedule) {
      setAvailableTimes(daySchedule.times);
    } else {
      // 만약 해당 날짜 데이터가 없다면 (다른 월로 이동한 경우)
      // 해당 월의 데이터를 fetch
      const dateObj = dayjs(selectedDate);
      const year = dateObj.year();
      const month = dateObj.month() + 1;

      const fetchAndSetTimes = async () => {
        try {
          const res = await fetch(
            `https://sp-globalnomad-api.vercel.app/17-1/activities/${numericActivityId}/available-schedule?year=${year}&month=${String(
              month
            ).padStart(2, '0')}`
          );
          if (!res.ok) throw new Error('예약 가능 일정 조회 실패');

          const data: AvailableSchedule[] = await res.json();

          // 전체 데이터 저장
          setScheduleData(data);

          // 날짜만 추출
          const dates = data.map((d) => d.date);
          setAvailableDates(dates);

          // 선택된 날짜의 시간 설정
          const schedule = data.find((d) => d.date === selectedDate);
          setAvailableTimes(schedule?.times || []);
        } catch (err) {
          console.error(err);
          setAvailableTimes([]);
        }
      };

      fetchAndSetTimes();
    }
  }, [selectedDate, scheduleData, numericActivityId]);

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

        {/* 오른쪽 컬럼: 사이드바 */}
        <div className="hidden md:flex md:flex-col md:w-[300px] lg:w-[400px]">
          <ReservationSidebar
            activity={activity}
            onOpenDateModal={handleOpenDateModal}
            selectedDateText={selectedDateTimeText}
            selectedDate={selectedDate}
            selectedTimeId={selectedTimeId}
            participants={participants}
            availableDates={availableDates}
            availableTimes={availableTimes}
            onSelectDate={setSelectedDate}
            onSelectTime={setSelectedTimeId}
            onIncrementParticipants={() => setParticipants((prev) => prev + 1)}
            onDecrementParticipants={() =>
              setParticipants((prev) => Math.max(prev - 1, 1))
            }
            onReserve={handleReserve}
            onMonthChange={fetchAvailableDatesForMonth}
          />
        </div>
      </div>

      {/* 스티키 푸터 */}
      <section>
        <ReservationStickyFooter
          activity={activity}
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
            initialParticipants={participants}
          />
        )}
        {isDateModalOpen && (
          <DateModal
            onClose={handleCloseDateModal}
            onSelectDateTime={handleUpdateDateTime}
            activityId={numericActivityId}
            availableDates={availableDates}
            availableTimes={availableTimes}
            initialSelectedDate={selectedDate}
            initialSelectedTimeId={selectedTimeId}
            onMonthChange={fetchAvailableDatesForMonth}
          />
        )}
      </section>
    </main>
  );
}
