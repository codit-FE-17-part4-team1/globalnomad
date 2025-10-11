'use client';

import '@/styles/global.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { Calendar, Views } from 'react-big-calendar';
import { useMemo, useState } from 'react';
import { localizer } from '@/lib/calendarLocalizer';
import type { CalEvent, CalStatus } from '@/types/calendar';
import { mockCalEvents } from '@/app/Profile/ReservationStatus/mock/CalendarMockdata';
import PendingModal from '@/components/Modal/ReservationModal/PendingModal';
import ConfirmedModal from '@/components/Modal/ReservationModal/ConfirmedModal';
import CanceledModal from '@/components/Modal/ReservationModal/CanceledModal';

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
  const [reservationsForDate, setReservationsForDate] = useState<CalEvent[]>(
    []
  );

  const handleEventClick = (ev: CalEvent) => {
    setSelected(ev);

    // 같은 날 여러 데이터(신청,승인,거절)가 있다면 탭 이동할 수 있도록
    const clickedDate = ev.start.toDateString();
    const dailyReservations = mockCalEvents.filter(
      (event) => event.start.toDateString() === clickedDate
    );
    setReservationsForDate(
      // CalEvent[] 타입을 { nickname, people, status }[] 타입으로 변환 --> 이건 해석이 필요할 듯
      dailyReservations.map((e) => ({ ...e, people: 1 }))
    );
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelected(null);
  };

  // API 연동으로 받을 항목! async 어쩌고 ..
  const handleApprove = () => {};

  const handleReject = () => {};

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

      {openModal && selected && (
        <>
          {selected.status === 'pending' && (
            <PendingModal
              isOpen={openModal}
              onClose={handleCloseModal}
              status={selected.status}
              // date={formatDate(selected.start)}
              // time={formatTimeRange(selected.start, selected.end)}
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
              // date={formatDate(selected.start)}
              // time={formatTimeRange(selected.start, selected.end)}
              reservations={reservationsForDate}
            />
          )}

          {selected.status === 'canceled' && (
            <CanceledModal
              isOpen={openModal}
              onClose={handleCloseModal}
              status={selected.status}
              // date={formatDate(selected.start)}
              // time={formatTimeRange(selected.start, selected.end)}
              reservations={reservationsForDate}
            />
          )}
        </>
      )}

      {/* 10/09 상태에 따른 모달을 따로 작업했으니, 여기서 각각 상태에 맞게 불러야 할 듯 -- 우선 주석처리 */}
      {/* <BaseModal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelected(null);
        }}
        size="md"
        title="예약 정보"
        className="bg-white"
      > */}
      {/* status에 따라 보여지는 모달을 다르게 설정하기! 
        그러면 굳이 BaseModal을 여기서 import 하지 않아도 될 수도 ? 근데 각 컴포넌트에서는 매번 import 해야하는데 뭐가 더 효율적인지 고민 필요할 듯 */}
      {/* {selected && (
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
      </BaseModal> */}
    </>
  );
}
