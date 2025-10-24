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
  availableDates: string[]; // YYYY-MM-DD 형식
  className?: string;
}

const DatePickerBox: React.FC<DatePickerBoxProps> = ({
  selectedDate: initialDate,
  onSelectDate,
  availableDates,
  className,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    initialDate || null
  );

  useEffect(() => {
    setSelectedDate(initialDate || null);
  }, [initialDate]);

  const today = dayjs().startOf('day'); //  오늘 날짜 기준 정의

  const handleChange = (date: Date | null) => {
    if (!date) return;

    const today = dayjs().startOf('day');

    // 오늘 이전 날짜 선택 금지
    if (dayjs(date).isBefore(today, 'day')) {
      return;
    }

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
        } //  오늘 이전 날짜는 기본 선택되지 않게
        onChange={handleChange}
        minDate={today.toDate()} //  오늘 이전 비활성화
        showPopperArrow={false}
        shouldCloseOnSelect={true}
        inline
        dayClassName={(date) => {
          const dateStr = dayjs(date).format('YYYY-MM-DD');
          const today = dayjs().startOf('day');

          const classes = ['base-date']; // 기본 스타일

          // 일요일 색상
          if (date.getDay() === 0) {
            classes.push('sunday-date');
          }

          // 오늘 이전 날짜
          if (dayjs(date).isBefore(today, 'day')) {
            classes.push('disabled-date');
          }

          // 오늘 날짜
          if (dayjs(date).isSame(today, 'day')) {
            classes.push('today-date');
          }

          // 오늘 포함 이후 날짜 선택 가능 (예약 가능 여부 상관없이)
          if (!dayjs(date).isBefore(today, 'day')) {
            classes.push('selectable-date');
          }

          // 예약 가능한 날짜
          if (
            !dayjs(date).isBefore(today, 'day') &&
            availableDates.includes(dateStr)
          ) {
            classes.push('available-date');
          }

          return classes.join(' ');
        }}
        renderCustomHeader={(headerProps) => (
          <CustomHeader
            date={headerProps.date}
            decreaseMonth={headerProps.decreaseMonth}
            increaseMonth={headerProps.increaseMonth}
            prevMonthButtonDisabled={headerProps.prevMonthButtonDisabled}
            nextMonthButtonDisabled={headerProps.nextMonthButtonDisabled}
          />
        )}
      />
    </div>
  );
};

export default DatePickerBox;
