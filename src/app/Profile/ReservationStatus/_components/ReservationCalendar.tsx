'use client';

import { Calendar, Views } from 'react-big-calendar';
import { useState } from 'react';
import { localizer } from '@/lib/calendarLocalizer';

export default function ReservationCalendar() {
  // 공식 문서 살펴보는 중, 필요한 props이 무엇인지 흠 ..
  return (
    <Calendar
      culture="ko"
      localizer={localizer}
      defaultView={Views.MONTH}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 700 }}
    />
  );
}
