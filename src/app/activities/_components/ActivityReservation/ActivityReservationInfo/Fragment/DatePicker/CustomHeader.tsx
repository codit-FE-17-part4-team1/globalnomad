'use client';
import React from 'react';
import Image from 'next/image';
import { DatePickerProps } from 'react-datepicker';
import { getMonth, getYear } from 'date-fns';

export interface CustomHeaderProps extends Omit<DatePickerProps, 'onChange'> {
  date: Date;
  decreaseMonth(): void;
  increaseMonth(): void;
  prevMonthButtonDisabled: boolean;
  nextMonthButtonDisabled: boolean;
}

const CustomHeader = ({
  date,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
  decreaseMonth,
  increaseMonth,
}: CustomHeaderProps) => {
  return (
    <div
      className={
        'react-datepicker__header flex items-center justify-between px-3 py-2'
      }
    >
      {/* 이전 버튼 */}
      <button
        type="button"
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition disabled:opacity-40 cursor-pointer"
        aria-label="이전 달"
      >
        <Image src="/icon/btn/prev.svg" alt="이전" width={20} height={20} />
      </button>

      {/* 년/월 표시 */}
      <div className="font-bold text-md text-center">
        {getYear(date)}년 {getMonth(date) + 1}월
      </div>

      {/* 다음 버튼 */}
      <button
        type="button"
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition disabled:opacity-40 cursor-pointer"
        aria-label="다음 달"
      >
        <Image src="/icon/btn/next.svg" alt="다음" width={20} height={20} />
      </button>
    </div>
  );
};

export default CustomHeader;
