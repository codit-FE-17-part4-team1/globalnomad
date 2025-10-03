'use client';

import { Calendar, Views } from 'react-big-calendar';
import { useMemo, useState } from 'react';
import { localizer } from '@/lib/calendarLocalizer';
import type { CalEvent } from '@/types/calendar';
import BaseModal from '@/components/Modal/BaseModal';

const mock: CalEvent[] = [
  {
    id: 'e1',
    title: '피오르 체험',
    start: new Date(2025, 1, 10, 10),
    end: new Date(2025, 1, 10, 12),
    place: '홍대 스튜디오',
    status: 'confirmed', // 승인
  },
  {
    id: 'e2',
    title: '열기구 페스티벌',
    start: new Date(2025, 1, 11, 14),
    end: new Date(2025, 1, 12, 12),
    place: '성수',
    status: 'pending', // 신청
  },
];

// type Props = {
//   events?: CalEvent[]; // 목 데이터 받기
// };

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
        className="px-2 py-1 text-sm"
        onClick={() => onNavigate('PREV')}
      >
        <span className="text-2xl">«</span>
      </button>
      <span className="font-bold">{title}</span>
      <button
        type="button"
        aria-label="다음 달"
        className="px-2 py-1 text-sm"
        onClick={() => onNavigate('NEXT')}
      >
        <span className="text-2xl">»</span>
      </button>
    </div>
  );
}

export default function ReservationCalendar() {
  //   const [data, setData] = useState<CalEvent[]>(events);

  //   useEffect(() => setData(events), [events]);

  const [openModal, setOpenModal] = useState(false);

  const handleEventClick = () => {
    setOpenModal(true);
  };

  const formats = useMemo(
    () => ({
      weekdayFormat: 'eee', // 일주일을 Sun, Mon, Tue ... 로 나타내기 위함 (S,M,T ... 로 나타내려면 'eeeee' , Sunday, Monday ... 는 'eeee') 암튼 커스텀 가능!
    }),
    []
  );

  return (
    <>
      {/* 일단 필요한 prop만 ! */}
      <Calendar<CalEvent>
        culture="en"
        localizer={localizer}
        views={[Views.MONTH]}
        defaultView={Views.MONTH}
        events={mock}
        startAccessor="start"
        endAccessor="end"
        formats={formats}
        onSelectEvent={handleEventClick}
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
      <BaseModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        size="md"
      >
        <div>예약정보</div>
      </BaseModal>
    </>
  );
}
