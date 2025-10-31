'use client';

import '@/styles/global.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import {
  Calendar,
  Views,
  ToolbarProps as RBCToolbarProps,
  DateLocalizer,
} from 'react-big-calendar';
import { useMemo, useState } from 'react';
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

function MonthToolbar({
  date,
  localizer,
  onNavigate,
}: RBCToolbarProps<CalEvent>) {
  const loc = localizer as DateLocalizer;
  const title = loc.format(date, 'yyyy년 M월');

  const handlePrev = () => {
    onNavigate('PREV');
  };

  const handleNext = () => {
    onNavigate('NEXT');
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

export default function ReservationCalendar({
  dashboardData,
  currentDate,
  onNavigate,
  onSelectDate,
  reservationsForDate,
  onApprove,
  onReject,
}: ReservationCalendarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<CalEvent | null>(null);
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const [modalPosition, setModalPosition] = useState<
    { top: number; left: number } | undefined
  >(undefined);

  // 달력 텍스트 추가를 위한 커스텀 작업
  function CalendarEvent({ event }: { event: CalEvent }) {
    const dateString = dayjs(event.start).format('YYYY-MM-DD');
    const dashboardItem = dashboardData.find(
      (item) => item.date === dateString
    );

    if (!dashboardItem) return null;

    let text = '';
    let textColor = '';

    if (event.status.includes('pending')) {
      text = `예약 ${dashboardItem.reservations.pending}`;
      textColor = '#FFFFFF';
    } else if (event.status.includes('confirmed')) {
      text = `승인 ${dashboardItem.reservations.confirmed}`;
      textColor = '#FF9B00';
    } else if (event.status.includes('completed')) {
      text = `완료 ${dashboardItem.reservations.completed}`;
      textColor = '#063b2d';
    }

    return (
      <div className="flex items-center justify-start h-full px-1">
        <span className="text-xs font-medium" style={{ color: textColor }}>
          {text}
        </span>
      </div>
    );
  }

  // API 응답(dashboardData)을 캘린더가 이해할 수 있는 CalEvent[] 형태로 변환
  const calendarEvents = useMemo<CalEvent[]>(() => {
    const events = dashboardData.flatMap((item) => {
      const baseDate = new Date(item.date);
      const eventsForDate: CalEvent[] = [];

      // pending 이벤트
      if (item.reservations.pending > 0) {
        const startDate = new Date(baseDate);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(baseDate);
        endDate.setHours(0, 30, 0, 0);

        eventsForDate.push({
          id: `${item.date}-pending`,
          title: '',
          start: startDate,
          end: endDate,
          status: ['pending'],
        });
      }

      // confirmed 이벤트
      if (item.reservations.confirmed > 0) {
        const startDate = new Date(baseDate);
        startDate.setHours(1, 0, 0, 0);
        const endDate = new Date(baseDate);
        endDate.setHours(1, 30, 0, 0);

        eventsForDate.push({
          id: `${item.date}-confirmed`,
          title: '',
          start: startDate,
          end: endDate,
          status: ['confirmed'],
        });
      }

      // declined 이벤트
      if (item.reservations.declined > 0) {
        const startDate = new Date(baseDate);
        startDate.setHours(2, 0, 0, 0);
        const endDate = new Date(baseDate);
        endDate.setHours(2, 30, 0, 0);

        eventsForDate.push({
          id: `${item.date}-declined`,
          title: '',
          start: startDate,
          end: endDate,
          status: ['declined'],
        });
      }

      // completed 따로 빼기
      if (item.reservations.completed > 0) {
        const startDate = new Date(baseDate);
        startDate.setHours(3, 0, 0, 0);
        const endDate = new Date(baseDate);
        endDate.setHours(3, 30, 0, 0);

        eventsForDate.push({
          id: `${item.date}-completed`,
          title: '',
          start: startDate,
          end: endDate,
          status: ['completed'],
        });
      }

      return eventsForDate;
    });

    return events;
  }, [dashboardData]);

  const formattedReservationsForModal = useMemo(() => {
    if (!reservationsForDate) {
      return [];
    }

    const formatted = reservationsForDate.reservations.map((r) => {
      return {
        id: r.id,
        nickname: r.nickname,
        people: r.headCount,
        status: (r.status === 'declined'
          ? 'canceled'
          : r.status) as ReservationStatus,
        time: `${r.startTime}~${r.endTime}`,
      };
    });

    return formatted;
  }, [reservationsForDate]);

  // 이벤트 클릭 핸들러 - 클릭한 요소의 위치 정보 저장
  const handleEventClick = (ev: CalEvent, e: React.SyntheticEvent) => {
    setSelected(ev);
    const dateString = dayjs(ev.start).format('YYYY-MM-DD');
    onSelectDate(dateString);

    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const modalWidth = 430;

    let left = rect.right + 10; // 달력 셀 오른쪽에 10px 간격
    let top = rect.top;

    // 화면 밖으로 나가면 왼쪽에 표시
    if (left + modalWidth > window.innerWidth) {
      left = rect.left - modalWidth - 10;
    }

    // 아래로 나가면 조정
    if (top + 600 > window.innerHeight) {
      top = Math.max(10, window.innerHeight - 610);
    }

    setModalPosition({ top, left });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelected(null);
    setAnchorElement(null);
  };

  const handleNavigate = (newDate: Date) => {
    onNavigate(newDate);
  };

  const formats = useMemo(
    () => ({
      weekdayFormat: 'eee',
    }),
    []
  );

  return (
    <>
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
          event: CalendarEvent,
        }}
        eventPropGetter={(event) => {
          const background = event.status.includes('pending')
            ? '#0085FF' // 파랑 - 예약
            : event.status.includes('confirmed')
              ? '#F6EAD9' // 베이지 - 승인
              : event.status.includes('declined')
                ? '#D1D5DB' // 회색 - 거절
                : '#ced8d5'; // 기본값

          return {
            style: {
              backgroundColor: background,
              border: 'none',
              borderRadius: '4px',
              height: '23px',
              marginBottom: '2px',
            },
          };
        }}
      />

      {/* 조건부로 모달 열리게 하기 */}
      {isModalOpen && selected && (
        <>
          {selected.status.includes('pending') && (
            <PendingModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              status="pending"
              date={formatDate(selected.start)}
              time=""
              reservations={formattedReservationsForModal}
              onApprove={onApprove}
              onReject={onReject}
              position={modalPosition} // 추가!
            />
          )}
          {selected.status.includes('confirmed') && (
            <ConfirmedModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              status="confirmed"
              date={formatDate(selected.start)}
              time=""
              reservations={formattedReservationsForModal}
              position={modalPosition} // 추가!
            />
          )}
          {selected.status.includes('declined') && (
            <CanceledModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              status="declined"
              date={formatDate(selected.start)}
              time=""
              reservations={formattedReservationsForModal}
              position={modalPosition} // 추가!
            />
          )}
          {/* 완료 항목은 어차피 내용이 없어서 모달 안 보여지도록 다시 수정 */}
          {/* {selected.status.includes('completed') && (
            <CanceledModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              status="canceled"
              date={formatDate(selected.start)}
              time=""
              reservations={formattedReservationsForModal}
            />
          )} */}
        </>
      )}
    </>
  );
}
