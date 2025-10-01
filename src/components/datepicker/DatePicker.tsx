'use client';

import clsx from 'clsx';
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './datePicker.css';

type DatePickerType = {
  className?: string;
};
export default function DatePickerComponent({ className }: DatePickerType) {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const datePickerRef = useRef<DatePicker>(null);
  const handleDatePickerClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setFocus();
      datePickerRef.current.setOpen(true);
    }
  };
  return (
    <div className="relative w-fit rounded-sm border border-gray-700">
      <DatePicker
        ref={datePickerRef}
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        placeholderText="YY/MM/DD"
        className={clsx(
          className,
          'py-[11px] pl-4 pr-6 cursor-pointer w-[130px] text-md',
          'md:text-lg md:w-[374px] md:py-[15px]',
          'xs:w-[149px] xs:py-[17px]'
        )}
        // 하이트 56 44
      />
      <Image
        src="/icon/calendar.svg"
        alt="달력아이콘"
        width={27}
        height={27}
        className={clsx(
          'hidden absolute -translate-y-1/2 -translate-x-1/2 top-1/2 right-2.5 cursor-pointer',
          'md:block'
        )}
        onClick={handleDatePickerClick}
      />
    </div>
  );
}
