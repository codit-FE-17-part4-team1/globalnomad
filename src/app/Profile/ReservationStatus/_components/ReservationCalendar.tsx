'use client';

import '@/styles/global.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { Calendar, Views } from 'react-big-calendar';
import { useMemo, useState } from 'react';
import { getReservationsByDateAction } from '@/actions/myactivities.actions';
import { localizer } from '@/types/calendarLocalizer';
import type { CalEvent, ReservationStatus } from '@/types/calendar';
import PendingModal from '@/components/Modal/ReservationModal/PendingModal';
import ConfirmedModal from '@/components/Modal/ReservationModal/ConfirmedModal';
import CanceledModal from '@/components/Modal/ReservationModal/CanceledModal';
import type { ReservationDashboard } from '@/types/api/myactivities';

// 날짜를 'YYYY. MM. DD' 형식으로 변환하는 함수
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}년 ${month}월 ${day}일`;
}

// 날짜를 'YYYY-MM-DD' 형식으로 변환하는 함수
function toYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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

export default function ReservationCalendar({
  dashboardData,
  activityId,
}: {
  dashboardData: ReservationDashboard;
  activityId: number;
}) {
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState<CalEvent | null>(null);
  // 모달에 전달할 데이터의 타입을 명확하게 지정합니다.  --> 버그가 나서 확인 중인데 왜 이렇게 해야함? (공부중)
  const [reservationsForDate, setReservationsForDate] = useState<
    {
      nickname: string;
      people: number;
      status: ReservationStatus;
      time: string;
    }[]
  >([]);

  // API 응답(dashboardData)을 캘린더가 이해할 수 있는 CalEvent[] 형태로 변환합니다.
  const calendarEvents = useMemo<CalEvent[]>(() => {
    if (!dashboardData) return [];
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

  const handleEventClick = async (ev: CalEvent) => {
    setSelected(ev);
    try {
      // 클릭된 날짜의 상세 예약 목록을 API로 조회합니다.
      const data = await getReservationsByDateAction({
        activityId,
        date: toYYYYMMDD(ev.start),
      });

      // API 응답을 모달이 필요로 하는 형태로 가공합니다.
      const formattedReservations = data.reservations.map((r) => ({
        nickname: r.nickname,
        people: r.headCount,
        status: r.status === 'declined' ? 'canceled' : r.status, // API의 'declined'를 UI의 'canceled'로 변환
        time: `${r.startTime}~${r.endTime}`,
      }));

      setReservationsForDate(formattedReservations);
      setOpenModal(true);
    } catch (error) {
      console.error(error);
      // TODO: 사용자에게 에러 알림
    }
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
        events={calendarEvents}
        defaultDate={new Date(2025, 9, 1)} // TODO: 현재 날짜 또는 데이터에 기반한 날짜로 변경
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
              time="" // time prop은 이제 ReservationModalBase에서 관리됩니다.
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
              time=""
              reservations={reservationsForDate}
            />
          )}

          {selected.status === 'canceled' && (
            <CanceledModal
              isOpen={openModal}
              onClose={handleCloseModal}
              status={selected.status}
              date={formatDate(selected.start)}
              time=""
              reservations={reservationsForDate}
            />
          )}
        </>
      )}
    </>
  );
}
