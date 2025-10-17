'use client';

import React, { useState } from 'react';
import Price from '../ActivityReservationInfo/Fragment/Price';
import DateSelectButton from '../ActivityReservationInfo/Fragment/DateSelectButton';
import ReservationButton from '../ActivityReservationInfo/Fragment/ReservationButton';
import {
  DummyAvailableScheduleData,
  DummyActivityData,
} from '../../../data/DummyData';

interface ReservationStickyFooterProps {
  className?: string;
}

export default function ReservationStickyFooter({
  className = '',
}: ReservationStickyFooterProps) {
  // 더미 데이터 사용
  const activity = DummyActivityData;
  const [selectedDate, setSelectedDate] = useState<string | null>(
    DummyAvailableScheduleData[0]?.date || null
  );
  const [selectedTimeId, setSelectedTimeId] = useState<number | null>(null);

  const handleReserve = () => {
    if (!selectedDate || !selectedTimeId) return;
    console.log('예약하기 클릭!', {
      selectedDate,
      selectedTimeId,
    });
  };

  const handleOpenDateModal = () => {
    console.log('날짜 선택 모달 열기');
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden ${className}`}
    >
      <div className="mx-auto h-[83px] px-5 py-2 bg-white border-t border-gray-200 flex w-full items-center justify-between">
        {/* 가격 + 날짜 선택 */}
        <div className="flex flex-col justify-start gap-1">
          <Price price={activity.price} />
          <DateSelectButton
            onClick={handleOpenDateModal}
            className="w-auto text-left"
          />
        </div>

        {/* 예약하기 버튼 */}
        <div className="flex justify-end min-w-[100px] max-w-[300px] flex-1 ml-20">
          <ReservationButton
            disabled={!selectedDate || !selectedTimeId}
            onReserve={handleReserve}
            className="h-[56px] w-full"
          />
        </div>
      </div>
    </div>
  );
}
