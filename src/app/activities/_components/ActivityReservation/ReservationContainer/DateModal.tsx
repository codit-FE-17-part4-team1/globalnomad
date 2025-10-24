'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import DatePickerBox from '../ActivityReservationInfo/Fragment/DatePicker/DatePickerBox';
import TimePicker from '../ActivityReservationInfo/Fragment/TimePicker';
import MyButton from '@/components/Button/Button';
import type { AvailableTime } from '@/types/activity';

interface DateModalProps {
  onClose: () => void;
  onSelectDateTime: (formattedText: string, timeId: number) => void;
  activityId: number;
  availableDates: string[]; // page.tsx에서 전달
  availableTimes: AvailableTime[];
  initialSelectedDate?: string | null;
  initialSelectedTimeId?: number | null;
}

const DateModal: React.FC<DateModalProps> = ({
  onClose,
  onSelectDateTime,
  activityId,
  availableDates,
  availableTimes: parentAvailableTimes,
  initialSelectedDate = null,
  initialSelectedTimeId = null,
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(
    initialSelectedDate
  );
  const [selectedTimeId, setSelectedTimeId] = useState<number | null>(
    initialSelectedTimeId
  );
  const [availableTimes, setAvailableTimes] = useState<AvailableTime[]>(
    parentAvailableTimes || []
  );
  const [isLoading, setIsLoading] = useState(false);

  // 배경 스크롤 막기
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // 날짜 변경 시 시간 초기화 및 새 데이터 fetch
  useEffect(() => {
    if (!selectedDate) return;

    const fetchAvailableTimes = async () => {
      setIsLoading(true);
      try {
        // 날짜에서 year, month 추출
        const [year, month] = selectedDate.split('-');

        const res = await fetch(
          `/api/proxy/17-1/activities/${activityId}/available-schedule?year=${year}&month=${month}`
        );

        if (res.status === 404) {
          setAvailableTimes([]);
          return;
        }

        if (!res.ok) {
          console.error('Failed to fetch available times');
          setAvailableTimes([]);
          return;
        }

        const data: {
          date: string;
          times: { id: number; startTime: string; endTime: string }[];
        }[] = await res.json();

        // 현재 선택한 날짜의 time만 필터링
        const selectedDay = data.find((d) => d.date === selectedDate);
        const times = selectedDay?.times || [];
        setAvailableTimes(times);

        // 이전 선택 유지 로직
        // 이전에 선택한 시간(selectedTimeId)이 새로운 availableTimes에 존재하면 유지
        // 없으면 null로 초기화
        setSelectedTimeId((prevTimeId) =>
          times.some((t) => t.id === prevTimeId) ? prevTimeId : null
        );
      } catch (error) {
        console.error('Error fetching available times:', error);
        setAvailableTimes([]);
        setSelectedTimeId(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableTimes();
  }, [selectedDate, activityId]);

  // 선택 완료 처리
  const handleSelect = () => {
    if (!selectedDate || !selectedTimeId) return;

    const schedule = availableTimes.find((t) => t.id === selectedTimeId);
    if (!schedule) return;

    const formatted = `${selectedDate.replaceAll('-', '/')} ${schedule.startTime} ~ ${schedule.endTime}`;
    onSelectDateTime(formatted, selectedTimeId);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-0 md:p-5 bg-black/40"
      onClick={onClose}
    >
      <div
        className="flex flex-col gap-6
          w-full h-full p-5
          md:w-[480px] md:max-h-[90vh] md:h-auto md:p-10 md:rounded-3xl md:shadow-2xl
          overflow-y-auto bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-black-nomad">날짜</h2>
          <button
            className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition"
            onClick={onClose}
          >
            <Image src="/icon/btn/X_lg.svg" alt="닫기" width={30} height={30} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-6">
            {/* DatePicker */}
            <div className="flex items-center justify-center">
              <DatePickerBox
                className="w-[350px] px-8 py-2 border border-gray-300 rounded-md"
                selectedDate={selectedDate}
                onSelectDate={(dateStr: string) => setSelectedDate(dateStr)}
                availableDates={availableDates}
                activityId={activityId}
              />
            </div>

            {/* TimePicker */}
            {isLoading ? (
              <p className="text-center text-gray-500 py-4">
                시간 정보를 불러오는 중...
              </p>
            ) : availableTimes.length > 0 ? (
              <TimePicker
                selectedTimeId={selectedTimeId || undefined}
                onSelectTime={setSelectedTimeId}
                availableTimes={availableTimes}
              />
            ) : selectedDate ? (
              <p className="text-center text-gray-500 py-4">
                선택한 날짜에 예약 가능한 시간이 없습니다.
              </p>
            ) : (
              <p className="text-center text-gray-500 py-4">
                날짜를 선택해주세요.
              </p>
            )}
          </div>
        </div>

        {/* 선택 버튼 */}
        <MyButton
          color="buttonPrimary"
          disabled={!selectedDate || !selectedTimeId}
          onClick={handleSelect}
          className="flex items-center justify-center p-4 mt-auto"
        >
          확인
        </MyButton>
      </div>
    </div>
  );
};

export default DateModal;
