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
  const numericActivityId = activityId;

  const [activity, setActivity] = useState<ActivityDetailInfo | null>(null);
  const [reviews, setReviews] = useState<Reviews>({
    reviews: [],
    totalCount: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [scheduleData, setScheduleData] = useState<AvailableSchedule[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<AvailableTime[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeId, setSelectedTimeId] = useState<number | null>(null);
  const [selectedDateTimeText, setSelectedDateTimeText] =
    useState('날짜 선택하기');
  const [participants, setParticipants] = useState<number>(1);

  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);

  const isReservationEnabled = useMemo(() => {
    return selectedDate !== null && selectedTimeId !== null && participants > 0;
  }, [selectedDate, selectedTimeId, participants]);

  // 예약 API
  const reserveActivity = useCallback(
    async ({
      activityId,
      scheduleId,
      headCount,
    }: {
      activityId: number;
      scheduleId: number;
      headCount: number;
    }) => {
      try {
        const res = await fetch(`/api/createreservation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ activityId, scheduleId, headCount }),
          credentials: 'include',
        });

        if (!res.ok) {
          const errorData = await res.json();
          return { success: false, error: errorData.message || '예약 실패' };
        }

        const data = await res.json();
        return { success: true, data };
      } catch (err: unknown) {
        if (err instanceof Error) return { success: false, error: err.message };
        return { success: false, error: '알 수 없는 오류' };
      }
    },
    []
  );

  const handleReserve = useCallback(async () => {
    if (!isReservationEnabled || !selectedTimeId) return;

    const result = await reserveActivity({
      activityId: numericActivityId,
      scheduleId: selectedTimeId,
      headCount: participants,
    });

    if (result.success) {
      const goToMain = window.confirm(
        '예약이 완료되었습니다. 메인 화면으로 이동하시겠습니까?'
      );
      if (goToMain) router.push('/');
      else window.location.reload();
    } else {
      alert(result.error);
    }
  }, [
    isReservationEnabled,
    selectedTimeId,
    participants,
    numericActivityId,
    reserveActivity,
    router,
  ]);

  // 모달 상태
  const handleOpenDateModal = () => setIsDateModalOpen(true);
  const handleCloseDateModal = () => setIsDateModalOpen(false);
  const handleOpenParticipantsModal = () => setIsParticipantsModalOpen(true);
  const handleSelectParticipants = (num: number) => {
    setParticipants(num);
    setIsParticipantsModalOpen(false);
  };
  const handleUpdateDateTime = (formattedText: string, timeId: number) => {
    setSelectedDateTimeText(formattedText);
    setSelectedTimeId(timeId);
    setSelectedDate(formattedText.split(' ')[0].replace(/\//g, '-'));
    setIsDateModalOpen(false);
  };

  // 예약 가능한 날짜 조회
  const fetchAvailableDatesForMonth = useCallback(
    async (year: number, month: number) => {
      try {
        const res = await fetch(
          `/api/activities/${numericActivityId}/available-schedule?year=${year}&month=${String(
            month
          ).padStart(2, '0')}`
        );
        if (!res.ok) throw new Error('예약 가능 일정 조회 실패');

        const data: AvailableSchedule[] = await res.json();
        setScheduleData(data);
        setAvailableDates(data.map((d) => d.date));
      } catch (err: unknown) {
        console.error(err);
        setScheduleData([]);
        setAvailableDates([]);
        setAvailableTimes([]);
      }
    },
    [numericActivityId]
  );

  // 초기 데이터 fetch
  useEffect(() => {
    if (isNaN(activityId) || activityId <= 0) {
      setLoading(false);
      setError('잘못된 체험 아이디입니다.');
      return;
    }

    // 체험 상세 API 조회
    const fetchActivity = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/activities/${numericActivityId}`);
        if (!res.ok) throw new Error('체험 상세 조회 실패');
        const data: ActivityDetailInfo = await res.json();
        setActivity(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError('알 수 없는 오류');
      } finally {
        setLoading(false);
      }
    };

    // 체험 리뷰 API 조회
    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `/api/activities/${numericActivityId}/reviews?page=1&size=3` // 경로 수정
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
      } catch (err: unknown) {
        console.error(err);
        setReviews({ reviews: [], totalCount: 0, averageRating: 0 });
      }
    };

    fetchActivity();
    fetchReviews();

    const today = dayjs();
    fetchAvailableDatesForMonth(today.year(), today.month() + 1);
  }, [activityId, numericActivityId, fetchAvailableDatesForMonth]);

  // 선택된 날짜에 따라 시간 설정
  useEffect(() => {
    if (!selectedDate) {
      setAvailableTimes([]);
      setSelectedTimeId(null);
      setSelectedDateTimeText('날짜 선택하기');
      return;
    }

    const daySchedule = scheduleData.find((d) => d.date === selectedDate);
    if (daySchedule) {
      setAvailableTimes(daySchedule.times);
    } else {
      const dateObj = dayjs(selectedDate);
      fetchAvailableDatesForMonth(dateObj.year(), dateObj.month() + 1);
    }
  }, [selectedDate, scheduleData, fetchAvailableDatesForMonth]);

  // 렌더링
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
