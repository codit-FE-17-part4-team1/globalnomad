'use client';

import clsx from 'clsx';
import React, { useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './TimePicker.css';

type StartTimePickerProps = {
  className?: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
};
export default function StartTimePicker({
  className,
  value,
  onChange,
}: StartTimePickerProps) {
  const startRef = useRef<DatePicker | null>(null);

  const handleStartClick = () => startRef.current?.setOpen(true);

  return (
    <div className="relative">
      <DatePicker
        ref={startRef}
        selected={value}
        onChange={onChange}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        timeCaption="시간"
        dateFormat="HH:mm"
        placeholderText="0:00"
        className={clsx(
          className,
          'border px-3 py-2 rounded w-[80px] text-center cursor-pointer text-md',
          'md:text-lg md:py-[15px]',
          'lg:w-[140px]'
        )}
      />
      <button
        type="button"
        className="absolute top-1/2 right-2 -translate-y-1/2"
        onClick={handleStartClick}
      >
        ▼
      </button>
    </div>
  );
}
