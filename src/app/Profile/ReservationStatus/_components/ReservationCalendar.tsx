'use client';

import { Calendar, Views } from 'react-big-calendar';
import { useMemo } from 'react';
import { localizer } from '@/lib/calendarLocalizer';
import type { CalEvent } from '@/types/calendar';

type Props = {
  events?: CalEvent[]; // 없으면 내부에서 빈 배열 사용
};

type ToolbarProps = {
  date: Date;
  localizer: any;
  onNavigate: (action: 'PREV' | 'NEXT') => void;
};

function MonthToolbar({ date, localizer, onNavigate }: ToolbarProps) {
  const title = localizer.format(date, 'yyyy년 M월');
  return (
    <div className="mb-3 flex items-center justify-center gap-6">
      <button
        type="button"
        aria-label="이전 달"
        className="rounded-md borer px-2 py-1 text-sm"
        onClick={() => onNavigate('PREV')}
      >
        <span className="text-2xl">«</span>
      </button>
      <span className="font-bold">{title}</span>
      <button
        type="button"
        aria-label="다음 달"
        className="rounded-md borer px-2 py-1 text-sm"
        onClick={() => onNavigate('NEXT')}
      >
        <span className="text-2xl">»</span>
      </button>
    </div>
  );
}

export default function ReservationCalendar({ events = [] }: Props) {
  const messages = useMemo(
    () => ({
      showMore: (n: number) => `+${n} 더보기`,
    }),
    []
  );

  const formats = useMemo(
    () => ({
      weekdayFormat: 'EEEEE', // 일주일을 나타냄
    }),
    []
  );

  return (
    <Calendar
      culture="en"
      localizer={localizer}
      views={[Views.MONTH]}
      defaultView={Views.MONTH}
      events={events}
      startAccessor="start"
      endAccessor="end"
      messages={messages}
      formats={formats}
      popup
      selectable
      components={{
        toolbar: MonthToolbar,
      }}
      eventPropGetter={(event) => {
        // UI 스타일링 (색상 스위치)
        const base = 'rounded-md h-2 mt-1';
        const className =
          event.tone === 'beige'
            ? `${base} bg-amber-100`
            : `${base} bg-blue-500`;
        return { className };
      }}
      style={{ height: 640 }}
    />
  );
}
