// 목표: 여긴 UI만 남겨두고 api가 들어가는 기능은 따로 구분하기 !
// 그럼 뭐를 빼야하는지 구분을 해봐야겠다.

'use client';

import '@/styles/global.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { Calendar, Views } from 'react-big-calendar';
import { useEffect, useMemo, useState } from 'react';
import { localizer } from '@/types/calendarLocalizer';
import type { CalEvent, ReservationStatus } from '@/types/calendar';
import PendingModal from '@/components/Modal/ReservationModal/PendingModal';
import ConfirmedModal from '@/components/Modal/ReservationModal/ConfirmedModal';
import CanceledModal from '@/components/Modal/ReservationModal/CanceledModal';
import type {
  ReservationDashboard,
  ReservationsTime,
} from '@/types/api/myactivities';
import { formatDate } from '@/utils/timechanges';
import dayjs from 'dayjs';

// 이것도 따로 빼도 될까나?
type ToolbarProps = {
  date: Date;
  localizer: any;
  onNavigate: (date: Date) => void;
};

function MonthToolbar({ date, localizer, onNavigate }: ToolbarProps) {
  const title = localizer.format(date, 'yyyy년 M월');

  const handlePrev = () => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() - 1);
    onNavigate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() - 1);
    onNavigate(newDate);
  };

  return (
    <div className="mb-3 flex items-center justify-center gap-6">
      <button
        type="button"
        aria-label="이전 달"
        className="px-2 py-1 text-sm"
        onClick={handlePrev}
      >
        <span className="text-2xl">«</span>
      </button>
      <span className="font-bold">{title}</span>
      <button
        type="button"
        aria-label="다음 달"
        className="px-2 py-1 text-sm"
        onClick={handleNext}
      >
        <span className="text-2xl">»</span>
      </button>
    </div>
  );
}

interface ReservationCalendarProps {
  dashboardData: ReservationDashboard;
  activityId: number;
  currentDate: Date;
  onNavigate: (newDate: Date) => void;
  onSelectDate: (date: string | null) => void;
  reservationsForDate: ReservationsTime | null;
  isLoadingReservations: boolean;
  onApprove: (reservationId: number) => void;
  onReject: (reservationId: number) => void;
  updateError: string | null;
}

export default function ReservationCalendar({
  dashboardData,
  activityId,
  currentDate,
  onNavigate,
  onSelectDate,
  reservationsForDate,
  isLoadingReservations,
  onApprove,
  onReject,
  updateError,
}: ReservationCalendarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<CalEvent | null>(null);

  // 디버깅 코드
  useEffect(() => {
    console.log('ReservationCalendar currentDate 변경됨:', currentDate);
  }, [currentDate]);

  // API 응답(dashboardData)을 캘린더가 이해할 수 있는 CalEvent[] 형태로 변환
  const calendarEvents = useMemo<CalEvent[]>(() => {
    return dashboardData.flatMap((item) => {
      const date = new Date(item.date);
      const events: CalEvent[] = [];

      if (item.reservations.pending > 0) {
        events.push({
          id: `${item.date}-pending`,
          start: date,
          end: date,
          status: 'pending',
          statuses: ['pending'],
        });
      }
      if (item.reservations.confirmed > 0 || item.reservations.completed > 0) {
        events.push({
          id: `${item.date}-confirmed`,
          start: date,
          end: date,
          status: 'confirmed',
          statuses: ['confirmed', 'completed'],
        });
      }
      return events;
    });
  }, [dashboardData]);

  // 여기서 문제가 생김 -> 수정 완료
  const formattedReservationsForModal = useMemo(() => {
    console.log('🔍 reservationsForDate 원본:', reservationsForDate);

    if (!reservationsForDate) return [];

    const flatReservations = reservationsForDate.reservations.flatMap((item) =>
      Array.isArray(item.reservations) ? item.reservations : [item]
    );

    console.log('🔍 flatReservations:', flatReservations);

    return flatReservations.map((r) => ({
      id: r.id,
      nickname: r.nickname,
      people: r.headCount,
      status: (r.status === 'declined'
        ? 'canceled'
        : r.status) as ReservationStatus,
      time: `${r.startTime}~${r.endTime}`,
    }));
  }, [reservationsForDate]);

  const handleEventClick = (ev: CalEvent) => {
    setSelected(ev);
    const dateString = dayjs(ev.start).format('YYYY-MM-DD');

    onSelectDate(dateString);
    setIsModalOpen(true);
  };

  // 이 부분도 겹치는데 .. -> 일단 hook에서는 제거함
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelected(null);
  };

  const handleNavigate = (newDate: Date) => {
    console.log('handleNavigate 확인', newDate);
    onNavigate(newDate);
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
        date={currentDate}
        onNavigate={handleNavigate}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        selectable
        formats={formats}
        onSelectEvent={handleEventClick}
        toolbar={true}
        components={{
          toolbar: MonthToolbar,
          // event: EventBar,
        }}
        eventPropGetter={(event) => {
          // 각 이벤트는 단일 상태를 가지므로, 그 상태에 맞는 색상을 지정
          const background =
            event.status === 'pending'
              ? '#0085FF' // 파랑
              : event.status === 'confirmed'
                ? '#F6EAD9' // 베이지
                : '#D1D5DB'; // 기타

          return {
            style: {
              background,
              border: 'none',
              borderRadius: '4px',
              height: '16px',
            },
          };
        }}
      />

      {/* 조건부로 모달 열리게 하기 */}
      {isModalOpen && selected && (
        <>
          {selected.status === 'pending' && (
            <PendingModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              status={selected.status}
              date={formatDate(selected.start)}
              time=""
              reservations={formattedReservationsForModal}
              onApprove={onApprove}
              onReject={onReject}
            />
          )}
          {selected.status === 'confirmed' && (
            <ConfirmedModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              status={selected.status}
              date={formatDate(selected.start)}
              time=""
              reservations={formattedReservationsForModal}
            />
          )}
          {(selected.status === 'declined' ||
            selected.statuses.includes('confirmed')) && (
            <CanceledModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              status={selected.status}
              date={formatDate(selected.start)}
              time=""
              reservations={formattedReservationsForModal}
            />
          )}
        </>
      )}
    </>
  );
}
