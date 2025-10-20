'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import DatePickerBox from '../ActivityReservationInfo/Fragment/DatePicker/DatePickerBox';
import TimePicker from '../ActivityReservationInfo/Fragment/TimePicker';
import MyButton from '@/components/Button/Button';
import { DummyAvailableScheduleData } from '../../../data/DummyData';

interface DateModalProps {
  onClose: () => void;
  onSelectDateTime: (formattedText: string, timeId: number) => void;
}

const DateModal: React.FC<DateModalProps> = ({ onClose, onSelectDateTime }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeId, setSelectedTimeId] = useState<number | null>(null);

  // 배경 스크롤 막기
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const availableDates = useMemo(
    () => DummyAvailableScheduleData.map((s) => s.date),
    []
  );

  const handleSelect = () => {
    if (!selectedDate || !selectedTimeId) return;

    const schedule = DummyAvailableScheduleData.flatMap((s) =>
      s.date === selectedDate ? s.times : []
    ).find((t) => t.id === selectedTimeId);

    if (!schedule) return;

    const formatted = `${selectedDate.replaceAll('-', '/')} ${schedule.startTime} ~ ${schedule.endTime}`;

    onSelectDateTime(formatted, selectedTimeId);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-0 md:p-5 bg-black/40"
      onClick={onClose} // 오버레이 클릭 시 닫기
    >
      <div
        className="
          flex flex-col gap-6
          w-full h-full p-5
          md:w-[480px] md:max-h-[90vh] md:h-auto md:p-10 md:rounded-3xl md:shadow-2xl
          overflow-y-auto bg-white"
        onClick={(e) => e.stopPropagation()} // 모달 내용 클릭 시 이벤트 전파 중단
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

        <div className="flex-1 overflow-y-auto ">
          <div className="flex flex-col gap-6">
            {/* DatePicker */}
            <div className="flex items-center justify-center">
              <DatePickerBox
                className="w-[350px] px-8 py-2 border border-gray-300 rounded-md"
                selectedDate={selectedDate ? new Date(selectedDate) : null}
                onSelectDate={(date: Date) =>
                  setSelectedDate(date.toISOString().split('T')[0])
                }
                availableDates={availableDates}
              />
            </div>

            {/* TimePicker */}
            <TimePicker
              schedules={DummyAvailableScheduleData}
              selectedDate={selectedDate || undefined}
              selectedTimeId={selectedTimeId || undefined}
              onSelectTime={setSelectedTimeId}
            />
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
