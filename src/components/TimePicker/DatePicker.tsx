'use client';

import clsx from 'clsx';
import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '@/components/datepicker/datePicker.css';

type DatePickerType = {
  className?: string;
  value?: Date | null;
  onChange?: (date: Date | null) => void;
};

export default function DatePickerComponent({
  className,
  value,
  onChange,
}: DatePickerType) {
  const datePickerRef = useRef<DatePicker | null>(null);
  const [internalValue, setInternalValue] = useState<Date | null>(
    value || null
  );

  useEffect(() => {
    setInternalValue(value || null);
  }, [value]);

  const handleClick = () => {
    datePickerRef.current?.setOpen(true);
  };

  const handleChange = (date: Date | null) => {
    setInternalValue(date);
    onChange?.(date);
  };

  return (
    <div className="relative w-[100%] rounded-sm border border-gray-700">
      <DatePicker
        ref={datePickerRef}
        selected={internalValue}
        onChange={handleChange}
        placeholderText="YY/MM/DD"
        className={clsx(
          className,
          'px-3 py-2 rounded text-left cursor-pointer text-md',
          'md:text-lg md:py-[15px]'
        )}
      />
      <button
        type="button"
        onClick={handleClick}
        className="absolute top-1/2 right-2 -translate-y-1/2"
      >
        <Image
          src="/icon/calendar.svg"
          alt="달력아이콘"
          width={27}
          height={27}
        />
      </button>
    </div>
  );
}
