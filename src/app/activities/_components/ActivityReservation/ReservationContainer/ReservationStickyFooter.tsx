'use client';

import React from 'react';
import Price from '../ActivityReservationInfo/Price';
import OptionSelectButton from '../ActivityReservationInfo/OptionSelectButton';
import MyButton from '@/components/Button/Button';

import type { ActivityDetailInfo } from '@/types/activity';

interface ReservationStickyFooterProps {
  activity: ActivityDetailInfo;
  className?: string;
  onOpenParticipantsModal: () => void;
  onOpenDateModal: () => void;
  selectedDateText: string;
  selectedTimeId: number | null;
  participants: number;
  isReservationEnabled: boolean; // page.tsx에서 버튼 활성화 상태 받기
  onReserve: () => void; // page.tsx에서 예약 핸들러 받기
}

export default function ReservationStickyFooter({
  activity,
  className = '',
  onOpenParticipantsModal,
  onOpenDateModal,
  selectedDateText,
  participants,
  isReservationEnabled,
  onReserve,
}: ReservationStickyFooterProps) {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden ${className}`}
    >
      <div className="mx-auto h-[83px] px-5 py-2 bg-white border-t border-gray-200 flex w-full items-center justify-between">
        {/* 가격 + 인원 선택 */}
        <div className="flex flex-col items-start justify-start gap-1 min-w-[250px]">
          <div className="flex flex-row gap-2">
            <Price price={activity.price} showPerPerson={false} />
            <OptionSelectButton
              onClick={onOpenParticipantsModal}
              label={`/ ${participants}명`}
              className="text-lg font-medium text-orange-dark hover:underline focus:outline-none"
            />
          </div>
          <OptionSelectButton
            onClick={onOpenDateModal}
            label={selectedDateText || '날짜 선택하기'}
            className="text-md font-semibold text-orange-dark hover:underline focus:outline-none"
          />
        </div>

        {/* 예약하기 버튼 */}
        <div className="flex justify-end min-w-[100px] max-w-[250px] flex-1">
          <MyButton
            color="buttonPrimary"
            disabled={!isReservationEnabled}
            onClick={onReserve}
            className="h-[56px] w-full"
          >
            예약하기
          </MyButton>
        </div>
      </div>
    </div>
  );
}
