'use client';

import React, { useState, useRef } from 'react';
import clsx from 'clsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './TimePicker.css';

export default function StartTimePicker() {
  const [startTime, setStartTime] = useState<Date | null>(new Date());
  const startRef = useRef<DatePicker | null>(null);

  const handleStartClick = () => startRef.current?.setOpen(true);

  return (
    <div className="relative">
      <DatePicker
        ref={startRef}
        selected={startTime}
        onChange={(date: Date | null) => setStartTime(date)}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        timeCaption="시간"
        dateFormat="HH:mm"
        placeholderText="시작 시간"
        className="border px-3 py-2 rounded w-[80px] text-center cursor-pointer"
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
