'use client';

import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './datepicker.scss';
import dayjs from 'dayjs';
import { ko } from 'date-fns/locale';
import CustomHeader from './CustomHeader';

interface DatePickerBoxProps {
  selectedDate?: string | null; // YYYY-MM-DD 문자열 사용
  onSelectDate?: (dateStr: string) => void; // 서버 전송
  availableDates: string[];
  className?: string;

  onMonthChange?: (year: number, month: number) => void;
}

const DatePickerBox: React.FC<DatePickerBoxProps> = ({
  selectedDate,
  onSelectDate,
  availableDates,
  className,
  onMonthChange,
}) => {
  const today = dayjs().startOf('day');

  // DatePicker가 반환한 Date 객체를 로컬 기준 YYYY-MM-DD로 변환
  const toLocalDateString = (date: Date) => dayjs(date).format('YYYY-MM-DD');

  const handleChange = (date: Date | null) => {
    if (!date) return;

    const selectedStr = toLocalDateString(date);
    const todayStr = today.format('YYYY-MM-DD');

    // 오늘 이전 날짜 선택 불가
    if (dayjs(selectedStr).isBefore(todayStr, 'day')) return;

    onSelectDate?.(selectedStr);
  };

  return (
    <div className={className}>
      <DatePicker
        locale={ko}
        selected={selectedDate ? dayjs(selectedDate).toDate() : undefined}
        onChange={handleChange}
        minDate={today.toDate()}
        showPopperArrow={false}
        shouldCloseOnSelect={true}
        inline
        dayClassName={(date) => {
          const dateStr = toLocalDateString(date);
          const dayOfWeek = date.getDay(); // 0 = Sunday
          const todayStr = today.format('YYYY-MM-DD');

          const classes = ['base-date'];

          if (dayjs(dateStr).isBefore(todayStr, 'day'))
            classes.push('disabled-date');
          if (dayjs(dateStr).isSame(todayStr, 'day'))
            classes.push('today-date');
          if (dayOfWeek === 0) classes.push('sunday-date');
          if (availableDates.includes(dateStr)) classes.push('available-date');
          if (selectedDate && dateStr === selectedDate)
            classes.push('selected-date');

          return classes.join(' ');
        }}
        renderCustomHeader={(headerProps) => (
          <CustomHeader
            date={headerProps.date}
            decreaseMonth={() => {
              headerProps.decreaseMonth();
              const newDate = dayjs(headerProps.date).subtract(1, 'month');
              onMonthChange?.(newDate.year(), newDate.month() + 1);
            }}
            increaseMonth={() => {
              headerProps.increaseMonth();
              const newDate = dayjs(headerProps.date).add(1, 'month');
              onMonthChange?.(newDate.year(), newDate.month() + 1);
            }}
            prevMonthButtonDisabled={headerProps.prevMonthButtonDisabled}
            nextMonthButtonDisabled={headerProps.nextMonthButtonDisabled}
          />
        )}
      />
    </div>
  );
};

export default DatePickerBox;
