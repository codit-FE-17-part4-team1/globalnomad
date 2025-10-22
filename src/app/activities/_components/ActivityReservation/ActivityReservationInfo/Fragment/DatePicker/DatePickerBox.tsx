'use client';

import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './datepicker.scss';
import dayjs from 'dayjs';
import { ko } from 'date-fns/locale';
import CustomHeader from './CustomHeader';

interface DatePickerBoxProps {
  selectedDate?: Date | null;
  onSelectDate?: (date: Date) => void;
  activityId: number;
  className?: string;
}

const DatePickerBox: React.FC<DatePickerBoxProps> = ({
  selectedDate: initialDate,
  onSelectDate,
  activityId,
  className,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    initialDate || null
  );
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 초기 선택 날짜 상태 동기화
  useEffect(() => {
    setSelectedDate(initialDate || null);
  }, [initialDate]);

  const today = dayjs().startOf('day');

  // API 호출: 예약 가능한 날짜 조회
  const fetchAvailableDates = async (year: number, month: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://sp-globalnomad-api.vercel.app/17/activities/${activityId}/available-schedule?year=${year}&month=${String(
          month
        ).padStart(2, '0')}`
      );
      if (!res.ok) throw new Error('예약 가능 일정 조회 실패');
      const data: { date: string }[] = await res.json();
      const uniqueDates = Array.from(new Set(data.map((s) => s.date)));
      setAvailableDates(uniqueDates);
    } catch (err) {
      console.error(err);
      setAvailableDates([]);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 현재 연/월 스케줄 호출
  useEffect(() => {
    const now = dayjs();
    fetchAvailableDates(now.year(), now.month() + 1);
  }, []);

  // 날짜 선택 처리
  const handleChange = (date: Date | null) => {
    if (!date) return;

    // 오늘 이전 날짜 선택 금지
    if (dayjs(date).isBefore(today, 'day')) return;

    setSelectedDate(date);
    onSelectDate?.(date);
  };

  return (
    <div className={className}>
      <DatePicker
        locale={ko}
        selected={
          selectedDate && !dayjs(selectedDate).isBefore(today, 'day')
            ? selectedDate
            : undefined
        }
        onChange={handleChange}
        minDate={today.toDate()}
        showPopperArrow={false}
        shouldCloseOnSelect={true}
        inline
        dayClassName={(date) => {
          const dateStr = dayjs(date).format('YYYY-MM-DD');
          let classes = ['base-date'];

          if (date.getDay() === 0) classes.push('sunday-date');
          if (dayjs(date).isBefore(today, 'day')) classes.push('disabled-date');
          if (dayjs(date).isSame(today, 'day')) classes.push('today-date');
          if (!dayjs(date).isBefore(today, 'day'))
            classes.push('selectable-date');
          if (
            !dayjs(date).isBefore(today, 'day') &&
            availableDates.includes(dateStr)
          )
            classes.push('available-date');

          return classes.join(' ');
        }}
        renderCustomHeader={(headerProps) => (
          <CustomHeader
            date={headerProps.date}
            decreaseMonth={() => {
              headerProps.decreaseMonth();
              const newDate = dayjs(headerProps.date).subtract(1, 'month');
              fetchAvailableDates(newDate.year(), newDate.month() + 1);
            }}
            increaseMonth={() => {
              headerProps.increaseMonth();
              const newDate = dayjs(headerProps.date).add(1, 'month');
              fetchAvailableDates(newDate.year(), newDate.month() + 1);
            }}
            prevMonthButtonDisabled={headerProps.prevMonthButtonDisabled}
            nextMonthButtonDisabled={headerProps.nextMonthButtonDisabled}
          />
        )}
      />
      {loading && (
        <div className="text-center mt-2 text-gray-500">
          예약 가능 일정 불러오는 중...
        </div>
      )}
    </div>
  );
};

export default DatePickerBox;
