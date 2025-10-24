'use client';

import React from 'react';
import ActivityReservationInfo from '../ActivityReservationInfo/ActivityReservationInfo';
import type { ActivityDetailInfo, AvailableTime } from '@/types/activity';

interface ReservationSidebarProps {
  activity: ActivityDetailInfo;
  onOpenDateModal: () => void;
  selectedDateText: string;

  // Page에서 내려주는 상태와 콜백
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
}

const ReservationSidebar: React.FC<ReservationSidebarProps> = ({
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
}) => {
  return (
    <div
      className="
        hidden md:flex flex-col
        bg-white border border-[#DDDDDD]
        rounded-[12px] shadow-[0_4px_16px_0_rgba(17,34,17,0.05)]
        w-full min-w-[300px] max-w-[400px]
        md:h-[450px] md:sticky md:top-5
        lg:static lg:min-h-[100vh] lg:h-auto
        lg:overflow-auto
      "
    >
      <ActivityReservationInfo
        activity={activity}
        onOpenDateModal={onOpenDateModal}
        selectedDateText={selectedDateText}
        selectedDate={selectedDate}
        selectedTimeId={selectedTimeId}
        participants={participants}
        onSelectDate={onSelectDate}
        onSelectTime={onSelectTime}
        onIncrementParticipants={onIncrementParticipants}
        onDecrementParticipants={onDecrementParticipants}
        onReserve={onReserve}
        availableDates={availableDates}
        availableTimes={availableTimes}
      />
    </div>
  );
};

export default ReservationSidebar;
