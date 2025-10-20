'use client';

import React from 'react';
import ActivityReservationInfo from '../ActivityReservationInfo/ActivityReservationInfo';
import type { ActivityDetailInfo } from '@/types/activity';

interface ReservationSidebarProps {
  activity: ActivityDetailInfo;
  teamId: string;
  onOpenDateModal: () => void;
  selectedDateText: string; // 부모에서 내려받음
}

const ReservationSidebar: React.FC<ReservationSidebarProps> = ({
  activity,
  teamId,
  onOpenDateModal,
  selectedDateText,
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
        teamId={teamId}
        onOpenDateModal={onOpenDateModal}
        selectedDateText={selectedDateText}
      />
    </div>
  );
};

export default ReservationSidebar;
