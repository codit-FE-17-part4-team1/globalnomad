'use client';

import React, { useState, useEffect } from 'react';
import MyButton from '@/components/Button/Button';
import type { AvailableSchedule } from '@/types/activity';

interface TimePickerProps {
  selectedTimeId?: number;
  onSelectTime: (timeId: number) => void;
  selectedDate?: string; // YYYY-MM-DD
  activityId: number;
}

export default function TimePicker({
  selectedTimeId,
  onSelectTime,
  selectedDate,
  activityId,
}: TimePickerProps) {
  const [schedules, setSchedules] = useState<AvailableSchedule[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<
    AvailableSchedule['times'] | []
  >([]);
  const [loading, setLoading] = useState(false);

  // selectedDate 변경 시 API 호출
  useEffect(() => {
    if (!selectedDate) {
      setSchedules([]);
      setSelectedTimes([]);
      return;
    }

    const dateObj = new Date(selectedDate);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;

    const fetchSchedules = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://sp-globalnomad-api.vercel.app/17/activities/${activityId}/available-schedule?year=${year}&month=${String(month).padStart(2, '0')}`
        );
        if (!res.ok) throw new Error('예약 가능 일정 조회 실패');
        const data: {
          id: number;
          date: string;
          startTime: string;
          endTime: string;
        }[] = await res.json();

        // API 데이터를 TimePicker 구조로 변환
        const grouped: AvailableSchedule[] = data.reduce(
          (acc: AvailableSchedule[], cur) => {
            const existing = acc.find((s) => s.date === cur.date);
            if (existing) {
              existing.times.push({
                id: cur.id,
                startTime: cur.startTime,
                endTime: cur.endTime,
              });
            } else {
              acc.push({
                date: cur.date,
                times: [
                  {
                    id: cur.id,
                    startTime: cur.startTime,
                    endTime: cur.endTime,
                  },
                ],
              });
            }
            return acc;
          },
          []
        );

        setSchedules(grouped);
      } catch (err) {
        console.error(err);
        setSchedules([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [selectedDate, activityId]);

  // 선택된 날짜에 맞는 시간 목록 업데이트
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
      {loading ? (
        <div className="w-full h-[46px] flex items-center justify-center text-gray-500 text-lg">
          예약 가능한 시간 불러오는 중...
        </div>
      ) : selectedTimes.length > 0 ? (
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
