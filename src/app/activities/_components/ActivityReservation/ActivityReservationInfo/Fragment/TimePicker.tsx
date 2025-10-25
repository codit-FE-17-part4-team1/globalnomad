'use client';

import React from 'react';
import MyButton from '@/components/Button/Button';
import type { AvailableTime } from '@/types/activity';

interface TimePickerProps {
  selectedTimeId?: number;
  onSelectTime: (timeId: number) => void;
  availableTimes?: AvailableTime[];
}

export default function TimePicker({
  selectedTimeId,
  onSelectTime,
  availableTimes = [],
}: TimePickerProps) {
  return (
    <div className="flex flex-col items-start justify-center gap-3 w-full">
      <div className="text-xl font-bold text-black-nomad">예약 가능한 시간</div>
      {availableTimes.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 w-full">
          {availableTimes.map((time) => (
            <MyButton
              key={time.id}
              color={
                selectedTimeId === time.id
                  ? 'buttonCategoryActive'
                  : 'buttonCategory'
              }
              onClick={() => onSelectTime(time.id)}
              className="min-w-[117px] h-[46px]"
            >
              {time.startTime} - {time.endTime}
            </MyButton>
          ))}
        </div>
      ) : (
        <div className="w-full h-[46px] flex items-center justify-center text-gray-800 text-lg font-medium">
          예약 가능한 시간이 없습니다.
        </div>
      )}
    </div>
  );
}
