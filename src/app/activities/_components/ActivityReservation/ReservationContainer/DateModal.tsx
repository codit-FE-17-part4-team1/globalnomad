'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import DatePickerBox from '../ActivityReservationInfo/DatePicker/DatePickerBox';
import TimePicker from '../ActivityReservationInfo/TimePicker';
import MyButton from '@/components/Button/Button';
import type { AvailableTime } from '@/types/activity';

interface DateModalProps {
  onClose: () => void;
  onSelectDateTime: (formattedText: string, timeId: number) => void;
  availableDates: string[];
  availableTimes: AvailableTime[];
  initialSelectedDate?: string | null;
  initialSelectedTimeId?: number | null;
  onMonthChange?: (year: number, month: number) => void;
  onDateChange?: (date: string) => void; // 날짜 변경 콜백 추가
}

const DateModal: React.FC<DateModalProps> = ({
  onClose,
  onSelectDateTime,
  availableDates,
  availableTimes: parentAvailableTimes,
  initialSelectedDate = null,
  initialSelectedTimeId = null,
  onMonthChange,
  onDateChange,
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(
    initialSelectedDate
  );
  const [selectedTimeId, setSelectedTimeId] = useState<number | null>(
    initialSelectedTimeId
  );

  // 부모에서 전달받은 availableTimes를 그대로 사용
  const availableTimes = useMemo(() => {
    return parentAvailableTimes || [];
  }, [parentAvailableTimes]);

  // 배경 스크롤 막기
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // 날짜 변경 시 시간 초기화
  useEffect(() => {
    // 날짜가 변경되면 무조건 시간 선택 초기화
    setSelectedTimeId(null);
  }, [selectedDate]);

  // 날짜 선택 핸들러
  const handleDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr);
    // 부모 컴포넌트에 날짜 변경 알림
    onDateChange?.(dateStr);
  };

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
                onSelectDate={handleDateSelect}
                availableDates={availableDates}
                onMonthChange={onMonthChange}
              />
            </div>

            {/* TimePicker */}
            {availableTimes.length > 0 ? (
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
