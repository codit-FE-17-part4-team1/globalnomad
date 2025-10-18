'use client';

import React, { useState } from 'react';
import Price from './Fragment/Price';
import DatePickerBox from './Fragment/DatePicker/DatePickerBox';
import DateSelectButton from './Fragment/DateSelectButton';
import TimePicker from './Fragment/TimePicker';
import ParticipantsCounter from './Fragment/ParticipantsCounter';
import MyButton from '@/components/Button/Button';
import TotalPrice from './Fragment/TotalPrice';

import type { ActivityDetailInfo, AvailableSchedule } from '@/types/activity';
import { DummyAvailableScheduleData } from '../../../data/DummyData';

interface ActivityReservationInfoProps {
  activity: ActivityDetailInfo;
  teamId: string;
  onOpenDateModal: () => void;
  selectedDateText: string;
}

const ActivityReservationInfo: React.FC<ActivityReservationInfoProps> = ({
  activity,
  teamId,
  onOpenDateModal,
  selectedDateText,
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeId, setSelectedTimeId] = useState<number | null>(null);
  const [participants, setParticipants] = useState<number>(1);

  const availableDates = DummyAvailableScheduleData.map((s) => s.date);

  const handleIncrement = () => setParticipants((prev) => prev + 1);
  const handleDecrement = () =>
    setParticipants((prev) => Math.max(1, prev - 1));

  const handleReserve = () => {
    if (!selectedDate || !selectedTimeId) return;
    console.log('예약하기 클릭!', {
      selectedDate,
      selectedTimeId,
      participants,
    });
  };

  return (
    <div className="w-full min-w-[220px] max-w-[400px] flex flex-col mx-auto gap-4 px-6 py-10 bg-white">
      {/* 가격 */}
      <Price price={activity.price} />

      <div className="border-b border-black-nomad/25 min-w-[210px] max-w-[336px]" />

      {/* 날짜 선택 영역 */}
      <div className="flex flex-col gap-3">
        <div className="text-xl font-bold text-black-nomad">날짜</div>

        {/* 달력 선택 (모바일 & PC) */}
        <div className="block md:hidden lg:block">
          <div className="flex items-center justify-center">
            <DatePickerBox
              className="flex items-center justify-center w-[320px] py-2 border border-gray-300 rounded-md"
              selectedDate={selectedDate ? new Date(selectedDate) : null}
              onSelectDate={(date: Date) =>
                setSelectedDate(date.toISOString().split('T')[0])
              }
              availableDates={availableDates}
            />
          </div>
        </div>

        {/* 태블릿에서는 달력 대신 버튼 */}
        <div className="hidden md:flex lg:hidden">
          <DateSelectButton
            onClick={onOpenDateModal}
            label={selectedDateText}
          />
        </div>
      </div>

      {/* 시간 선택 영역 */}
      <div className="block md:hidden lg:flex flex-col gap-2">
        <TimePicker
          schedules={DummyAvailableScheduleData}
          selectedDate={selectedDate || undefined}
          selectedTimeId={selectedTimeId || undefined}
          onSelectTime={setSelectedTimeId}
        />
      </div>

      <div className="block md:hidden lg:block border-b border-black-nomad/25 min-w-[210px] max-w-[336px]" />

      {/* 참여 인원 */}
      <ParticipantsCounter
        participants={participants}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
      />

      {/* 예약 버튼 */}
      <MyButton
        color="buttonPrimary"
        disabled={!selectedDate || !selectedTimeId}
        onClick={handleReserve}
        className="flex items-center justify-center p-4"
      >
        예약하기
      </MyButton>

      <div className="border-b border-black-nomad/25 min-w-[210px] max-w-[336px]" />

      {/* 총 합계 */}
      <TotalPrice price={activity.price} participants={participants} />
    </div>
  );
};

export default ActivityReservationInfo;
