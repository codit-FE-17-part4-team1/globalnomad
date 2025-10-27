'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

import ReservationSidebar from './ReservationContainer/ReservationSidebar';
import ReservationStickyFooter from './ReservationContainer/ReservationStickyFooter';
import ParticipantsModal from './ReservationContainer/ParticipantsModal';
import DateModal from './ReservationContainer/DateModal';

import type {
  ActivityDetailInfo,
  AvailableSchedule,
  AvailableTime,
} from '@/types/activity';

interface ActivityReservationProps {
  activity: ActivityDetailInfo;
  scheduleData: AvailableSchedule[];
}

export default function ActivityReservation({
  activity,
  scheduleData: initialScheduleData,
}: ActivityReservationProps) {
  const router = useRouter();

  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeId, setSelectedTimeId] = useState<number | null>(null);
  const [participants, setParticipants] = useState<number>(1);

  const [scheduleData, setScheduleData] =
    useState<AvailableSchedule[]>(initialScheduleData);
  const [availableDates, setAvailableDates] = useState<string[]>(
    initialScheduleData.map((d) => d.date)
  );
  const [availableTimes, setAvailableTimes] = useState<AvailableTime[]>([]);

  const [selectedDateTimeText, setSelectedDateTimeText] =
    useState('날짜 선택하기');
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);

  // 오늘 기준 연/월 상태
  const [selectedYear, setSelectedYear] = useState(today.year());
  const [selectedMonth, setSelectedMonth] = useState(today.month() + 1);

  const isReservationEnabled = useMemo(
    () => selectedDate !== null && selectedTimeId !== null && participants > 0,
    [selectedDate, selectedTimeId, participants]
  );

  // 월 변경 시 예약 가능일 조회
  useEffect(() => {
    const fetchAvailableDatesForMonth = async () => {
      try {
        const res = await fetch(
          `/api/activities/${activity.id}/available-schedule?year=${selectedYear}&month=${String(
            selectedMonth
          ).padStart(2, '0')}`
        );
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || '예약 가능 일정 조회 실패');
        }
        const data: AvailableSchedule[] = await res.json();
        setScheduleData(data);
        setAvailableDates(data.map((d) => d.date));
      } catch (err) {
        console.error(err);
        setScheduleData([]);
        setAvailableDates([]);
      }
    };

    fetchAvailableDatesForMonth();
  }, [activity.id, selectedYear, selectedMonth]);

  // 선택한 날짜에 따라 시간 설정
  useEffect(() => {
    if (!selectedDate) {
      setAvailableTimes([]);
      setSelectedTimeId(null);
      return;
    }
    const daySchedule = scheduleData.find((d) => d.date === selectedDate);
    if (daySchedule) {
      setAvailableTimes(daySchedule.times);
      // 날짜가 변경되면 무조건 시간 선택 초기화
      setSelectedTimeId(null);
    } else {
      setAvailableTimes([]);
      setSelectedTimeId(null);
    }
  }, [selectedDate, scheduleData]);

  // 월 변경 처리
  const handleMonthChange = useCallback((year: number, month: number) => {
    setSelectedYear(year);
    setSelectedMonth(month);
  }, []);

  // 모달에서 날짜 변경 시 처리
  const handleModalDateChange = useCallback((dateStr: string) => {
    setSelectedDate(dateStr);
  }, []);

  // 모달 핸들러
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
    const dateStr = formattedText.split(' ')[0].replace(/\//g, '-');
    setSelectedDate(dateStr);
    setIsDateModalOpen(false);
  };

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

  // 예약하기
  const handleReserve = useCallback(async () => {
    if (!isReservationEnabled || !selectedTimeId) return;
    const result = await reserveActivity({
      activityId: activity.id,
      scheduleId: selectedTimeId,
      headCount: participants,
    });
    if (result.success) {
      if (
        window.confirm('예약이 완료되었습니다. 메인 화면으로 이동하시겠습니까?')
      ) {
        router.push('/');
      } else {
        window.location.reload();
      }
    } else {
      alert(result.error); // 로그인이 필요합니다 메세지 나옴
      // 에러 메시지에 "로그인" 문자열이 포함되어 있으면
      if (result.error?.includes('로그인')) {
        router.push('/Login'); // 로그인 페이지로 이동
      }
    }
  }, [
    isReservationEnabled,
    selectedTimeId,
    participants,
    activity.id,
    reserveActivity,
    router,
  ]);

  return (
    <>
      {/* 오른쪽 컬럼 */}
      <section className="hidden md:flex md:flex-col md:w-[300px] lg:w-[400px]">
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
          onMonthChange={handleMonthChange}
        />
      </section>

      {/* 스티키 푸터 */}
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
          availableDates={availableDates}
          availableTimes={availableTimes}
          initialSelectedDate={selectedDate}
          initialSelectedTimeId={selectedTimeId}
          onMonthChange={handleMonthChange}
          onDateChange={handleModalDateChange}
        />
      )}
    </>
  );
}
