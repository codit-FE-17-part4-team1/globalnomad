// 목표: 여긴 UI만 남겨두고 api가 들어가는 기능은 따로 구분하기 !
// 그럼 뭐를 빼야하는지 구분을 해봐야겠다.

'use client';

import '@/styles/global.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { Calendar, Views, SlotInfo } from 'react-big-calendar';
import { useMemo, useState, useEffect } from 'react';
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

interface ReservationCalendarProps {
  dashboardData: ReservationDashboard;
  activityId: number;
  onNavigate: (newDate: Date) => void;
  onSelectDate: (date: string | null) => void;
  reservationsForDate: ReservationsTime | null;
  isLoadingReservations: boolean;
  onApprove: (reservationId: number) => void;
  onReject: (reservationId: number) => void;
}

export default function ReservationCalendar({
  dashboardData,
  activityId,
  onNavigate,
  onSelectDate,
  reservationsForDate,
  isLoadingReservations,
  onApprove,
  onReject,
}: ReservationCalendarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<CalEvent | null>(null);

  // API 응답(dashboardData)을 캘린더가 이해할 수 있는 CalEvent[] 형태로 변환
  const calendarEvents = useMemo<CalEvent[]>(() => {
    return dashboardData.flatMap((item) => {
      const date = new Date(item.date);
      const events: CalEvent[] = [];
      if (item.reservations.pending > 0)
        events.push({
          id: `${item.date}-pending`,
          title: '예약 신청',
          start: date,
          end: date,
          status: 'pending',
        });
      if (item.reservations.confirmed > 0)
        events.push({
          id: `${item.date}-confirmed`,
          title: '예약 승인',
          start: date,
          end: date,
          status: 'confirmed',
        });
      if (item.reservations.completed > 0)
        // 'completed'도 'confirmed'로 처리
        events.push({
          id: `${item.date}-completed`,
          title: '예약 완료',
          start: date,
          end: date,
          status: 'confirmed',
        });
      return events;
    });
  }, [dashboardData]);

  const formattedReservationsForModal = useMemo(() => {
    if (!reservationsForDate) return [];
    return reservationsForDate.reservations.map((r) => ({
      id: r.id,
      nickname: r.nickname,
      people: r.headCount,
      status: r.status === 'declined' ? 'canceled' : r.status,
      time: `${r.startTime}~${r.endTime}`,
    }));
  }, [reservationsForDate]);

  const handleEventClick = async (ev: CalEvent) => {
    setSelected(ev);
    const dateString = dayjs(ev.start).format('YYYY-MM-DD');
    onSelectDate(dateString);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelected(null);
    onSelectDate(null);
  };

  const handleNavigate = (newDate: Date) => {
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
        onNavigate={handleNavigate}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        selectable
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
      {isModalOpen && selected && (
        <>
          {selected.status === 'pending' && (
            <PendingModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              status={selected.status}
              date={formatDate(selected.start)}
              time="" // time prop은 ReservationModalBase에서 관리
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
              onApprove={onApprove}
              onReject={onReject}
            />
          )}

          {selected.status === 'canceled' && (
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
