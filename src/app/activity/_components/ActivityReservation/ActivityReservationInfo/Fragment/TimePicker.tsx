'use client';

import React, { useState, useEffect } from 'react';
import MyButton from '@/components/Button/Button';
import type { AvailableSchedule } from '@/types/activity';

interface TimePickerProps {
  schedules: AvailableSchedule[];
  selectedTimeId?: number;
  onSelectTime: (timeId: number) => void;
  selectedDate?: string; // 선택된 날짜를 상위에서 전달받는 경우
}

export default function TimePicker({
  schedules,
  selectedTimeId,
  onSelectTime,
  selectedDate,
}: TimePickerProps) {
  const [selectedTimes, setSelectedTimes] = useState<
    AvailableSchedule['times'] | []
  >([]);

  // 선택된 날짜에 따른 예약 가능한 시간 설정
  useEffect(() => {
    if (!selectedDate) {
      setSelectedTimes([]);
      return;
    }
    const schedule = schedules.find((s) => s.date === selectedDate);
    setSelectedTimes(schedule?.times || []);
  }, [selectedDate, schedules]);

  return (
    <div className="flex flex-col items-start justify-center gap-3 w-full">
      <div className="text-xl font-bold text-black-nomad">예약 가능한 시간</div>
      {selectedTimes.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 w-full">
          {selectedTimes.map((time) => (
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
