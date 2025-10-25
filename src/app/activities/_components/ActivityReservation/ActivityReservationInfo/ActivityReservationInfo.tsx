'use client';

import React from 'react';
import Price from './Fragment/Price';
import DatePickerBox from './Fragment/DatePicker/DatePickerBox';
import OptionSelectButton from './Fragment/OptionSelectButton';
import TimePicker from './Fragment/TimePicker';
import ParticipantsCounter from './Fragment/ParticipantsCounter';
import MyButton from '@/components/Button/Button';
import TotalPrice from './Fragment/TotalPrice';

import type { ActivityDetailInfo, AvailableTime } from '@/types/activity';

interface ActivityReservationInfoProps {
  activity: ActivityDetailInfo;
  onOpenDateModal: () => void;
  selectedDateText: string;
  selectedDate: string | null;
  selectedTimeId: number | null;
  participants: number;
  onSelectDate: (date: string) => void;
  onSelectTime: (timeId: number) => void;
  onIncrementParticipants: () => void;
  onDecrementParticipants: () => void;
  onReserve: () => void;

  // 예약 가능 날짜/시간
  availableDates: string[];
  availableTimes: AvailableTime[];

  onMonthChange?: (year: number, month: number) => void;
}

const ActivityReservationInfo: React.FC<ActivityReservationInfoProps> = ({
  activity,
  onOpenDateModal,
  selectedDateText,
  selectedDate,
  selectedTimeId,
  participants,
  onSelectDate,
  onSelectTime,
  onIncrementParticipants,
  onDecrementParticipants,
  onReserve,
  availableDates,
  availableTimes,
  onMonthChange,
}) => {
  return (
    <div className="w-full flex flex-col mx-auto gap-5 px-6 py-10">
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
              selectedDate={selectedDate}
              onSelectDate={onSelectDate}
              availableDates={availableDates}
              activityId={activity.id}
              onMonthChange={onMonthChange}
            />
          </div>
        </div>

        {/* 태블릿에서는 달력 대신 버튼 */}
        <div className="hidden md:flex lg:hidden">
          <OptionSelectButton
            onClick={onOpenDateModal}
            label={selectedDateText || '날짜 선택하기'}
          />
        </div>
      </div>

      {/* 시간 선택 영역 */}
      <div className="block md:hidden lg:flex flex-col gap-2">
        <TimePicker
          selectedTimeId={selectedTimeId || undefined}
          availableTimes={availableTimes}
          onSelectTime={onSelectTime}
        />
      </div>

      <div className="block md:hidden lg:block border-b border-black-nomad/25 min-w-[210px] max-w-[336px]" />

      {/* 참여 인원 */}
      <ParticipantsCounter
        participants={participants}
        onIncrement={onIncrementParticipants}
        onDecrement={onDecrementParticipants}
        label="참여 인원 수"
      />

      {/* 예약 버튼 */}
      <MyButton
        color="buttonPrimary"
        disabled={!selectedDate || !selectedTimeId || participants <= 0}
        onClick={onReserve}
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
