'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import DatePickerBox from '../ActivityReservationInfo/Fragment/DatePicker/DatePickerBox';
import TimePicker from '../ActivityReservationInfo/Fragment/TimePicker';
import MyButton from '@/components/Button/Button';
import { DummyAvailableScheduleData } from '../../../data/DummyData';

interface ReservationDateModalProps {
  onClose: () => void;
  onSelectDateTime: (formattedText: string) => void;
}

const ReservationDateModal: React.FC<ReservationDateModalProps> = ({
  onClose,
  onSelectDateTime,
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeId, setSelectedTimeId] = useState<number | null>(null);

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
    onSelectDateTime(formatted);
    onClose();
  };

  return (
    <div className="flex flex-col justify-between w-[480px] min-h-[600px] max-h-[100vh] overflow-auto rounded-3xl bg-white p-10 shadow-2xl">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-black-nomad">날짜</h2>
        <button
          className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition"
          onClick={onClose}
        >
          <Image src="/icon/btn/X_lg.svg" alt="닫기" width={30} height={30} />
        </button>
      </div>

      {/* DatePicker */}
      <div className="flex items-center justify-center mb-6">
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

      {/* 선택 버튼 */}
      <div className="mt-8">
        <MyButton
          color="buttonPrimary"
          disabled={!selectedDate || !selectedTimeId}
          onClick={handleSelect}
          className="w-full"
        >
          선택하기
        </MyButton>
      </div>
    </div>
  );
};

export default ReservationDateModal;
