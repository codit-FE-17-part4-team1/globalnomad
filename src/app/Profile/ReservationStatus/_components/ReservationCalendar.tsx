'use client';

import '@/styles/global.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { Calendar, Views } from 'react-big-calendar';
import { useMemo, useState } from 'react';
import { localizer } from '@/lib/calendarLocalizer';
import type { CalEvent, ReservationStatus } from '@/types/calendar';
import { mockCalEvents } from '@/app/Profile/ReservationStatus/mock/CalendarMockdata';
import PendingModal from '@/components/Modal/ReservationModal/PendingModal';
import ConfirmedModal from '@/components/Modal/ReservationModal/ConfirmedModal';
import CanceledModal from '@/components/Modal/ReservationModal/CanceledModal';

// 날짜를 'YYYY. MM. DD' 형식으로 변환하는 함수
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}년 ${month}월 ${day}일`;
}

// 시간을 'HH:mm ~ HH:mm' 형식으로 변환하는 함수
function formatTimeRange(start: Date, end: Date): string {
  const startTime = `${String(start.getHours()).padStart(2, '0')}:${String(
    start.getMinutes()
  ).padStart(2, '0')}`;
  const endTime = `${String(end.getHours()).padStart(2, '0')}:${String(
    end.getMinutes()
  ).padStart(2, '0')}`;
  return `${startTime} ~ ${endTime}`;
}

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
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState<CalEvent | null>(null);
  // 모달에 전달할 데이터의 타입을 명확하게 지정합니다.  --> 버그가 나서 확인 중인데 왜 이렇게 해야함? (공부중)
  const [reservationsForDate, setReservationsForDate] = useState<
    {
      nickname: string;
      people: number;
      status: ReservationStatus;
    }[]
  >([]);

  const handleEventClick = (ev: CalEvent) => {
    setSelected(ev);

    // 같은 날 여러 데이터(신청,승인,거절)가 있다면 탭 이동할 수 있도록
    const clickedDate = ev.start.toDateString();
    const dailyReservations = mockCalEvents.filter(
      (event) => event.start.toDateString() === clickedDate
    );
    setReservationsForDate(
      dailyReservations.map((e) => ({
        ...e,
        nickname: e.nickname || '',
        people: e.people || 0, // people이 없으면 0을 기본값으로 사용
      }))
    );
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelected(null);
  };

  // API 연동으로 받을 항목! async 어쩌고 ..
  const handleApprove = (nickname: string) => {
    console.log(`${nickname}님 예약 승인`);
  };

  const handleReject = (nickname: string) => {
    console.log(`${nickname}님 예약 거절`);
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
        events={mockCalEvents}
        defaultDate={mockCalEvents[0].start}
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

      {/* 모달 조립해보기 (신청, 승인, 거절) - 전달해야하는 Props와 Type들이 어렵군, 타입때문에 오류가 나는 듯 ㅠ*/}
      {openModal && selected && (
        <>
          {selected.status === 'pending' && (
            <PendingModal
              isOpen={openModal}
              onClose={handleCloseModal}
              status={selected.status}
              date={formatDate(selected.start)}
              time={
                selected.time || formatTimeRange(selected.start, selected.end)
              }
              reservations={reservationsForDate}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}

          {selected.status === 'confirmed' && (
            <ConfirmedModal
              isOpen={openModal}
              onClose={handleCloseModal}
              status={selected.status}
              date={formatDate(selected.start)}
              time={
                selected.time || formatTimeRange(selected.start, selected.end)
              }
              reservations={reservationsForDate}
            />
          )}

          {selected.status === 'canceled' && (
            <CanceledModal
              isOpen={openModal}
              onClose={handleCloseModal}
              status={selected.status}
              date={formatDate(selected.start)}
              time={
                selected.time || formatTimeRange(selected.start, selected.end)
              }
              reservations={reservationsForDate}
            />
          )}
        </>
      )}
    </>
  );
}
