'use client';

import '@/styles/global.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { Calendar, Views } from 'react-big-calendar';
import { useMemo, useState } from 'react';
import { localizer } from '@/lib/calendarLocalizer';
import type { CalEvent } from '@/types/calendar';
import BaseModal from '@/components/Modal/BaseModal';

const mock: CalEvent[] = [
  {
    id: 'e1',
    title: '피오르 체험',
    start: new Date(2025, 10, 10, 10),
    end: new Date(2025, 10, 10, 12),
    place: '홍대 스튜디오',
    status: 'confirmed', // 승인
  },
  {
    id: 'e2',
    title: '열기구 페스티벌',
    start: new Date(2025, 10, 11, 14),
    end: new Date(2025, 10, 12, 12),
    place: '성수',
    status: 'pending', // 신청
  },
  {
    id: 'e3',
    title: '먹방',
    start: new Date(2025, 10, 15, 10),
    end: new Date(2025, 10, 15, 12),
    place: '잠실',
    status: 'canceled', // 취소
  },
];

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

function EventBar() {
  return <div className="h-2 w-full rounded-md" />;
}

export default function ReservationCalendar() {
  //   const [data, setData] = useState<CalEvent[]>(events);

  //   useEffect(() => setData(events), [events]);

  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState<CalEvent | null>(null);

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
        defaultDate={mock[0].start}
        startAccessor="start"
        endAccessor="end"
        formats={formats}
        onSelectEvent={handleEventClick}
        components={{
          toolbar: MonthToolbar,
          event: EventBar,
        }}
        eventPropGetter={(event) => {
          const color =
            event.status === 'confirmed'
              ? '#F6EAD9' // 베이지
              : event.status === 'pending'
                ? '#3B82F6' // 파랑
                : '#D1D5DB'; // 회색(취소)
          return {
            style: {
              backgroundColor: color,
              border: 'none',
              borderRadius: 3,
              height: 20,
            },
          };
        }}
      />
      <BaseModal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelected(null);
        }}
        size="md"
        title="예약 정보"
      >
        {/* status에 따라 보여지는 모달을 다르게 설정하기! 
        그러면 굳이 BaseModal을 여기서 import 하지 않아도 될 수도 ? 근데 각 컴포넌트에서는 매번 import 해야하는데 뭐가 더 효율적인지 고민 필요할 듯 */}
        {selected && (
          <div>
            <p className="text-sm text-gray-600">
              {selected.start.toLocaleString()} ~{' '}
              {selected.end.toLocaleString()}
            </p>
            {selected.place && (
              <p className="mt-1 text-sm">장소: {selected.place}</p>
            )}
            <p className="mt-1 text-sm">상태: {selected.status}</p>
          </div>
        )}
      </BaseModal>
    </>
  );
}
