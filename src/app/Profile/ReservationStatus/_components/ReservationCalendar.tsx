// 목표: 여긴 UI만 남겨두고 api가 들어가는 기능은 따로 구분하기 !
// 그럼 뭐를 빼야하는지 구분을 해봐야겠다.

'use client';

import '@/styles/global.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { Calendar, Views } from 'react-big-calendar';
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

// 해당 상태는 따로 api랑 같이 빼야 할 듯
export default function ReservationCalendar({
  dashboardData,
  activityId,
}: {
  dashboardData: ReservationDashboard;
  activityId: number;
}) {
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState<CalEvent | null>(null);
  // 모달에 전달할 데이터의 타입을 지정  --> 버그가 나서 확인 중인데 왜 이렇게 해야함? (공부중)
  const [reservationsForDate, setReservationsForDate] = useState<
    {
      nickname: string;
      people: number;
      status: ReservationStatus;
      time: string;
      id: number;
    }[]
  >([]);

  // API 응답(dashboardData)을 캘린더가 이해할 수 있는 CalEvent[] 형태로 변환
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

  // 임시 mock 데이터
  const mockReservationsByDate: ReservationsTime = {
    cursorId: 0,
    totalCount: 2,
    reservations: [
      {
        id: 1,
        nickname: '짱구',
        userId: 1,
        teamId: '17-1',
        activityId: 1,
        scheduleId: 1,
        status: 'pending',
        reviewSubmitted: false,
        totalPrice: 10000,
        headCount: 2,
        date: '2025-10-10',
        startTime: '10:00',
        endTime: '12:00',
        createdAt: '',
        updatedAt: '',
      },
      {
        id: 2,
        nickname: '짱아',
        userId: 2,
        teamId: '17-1',
        activityId: 1,
        scheduleId: 1,
        status: 'confirmed',
        reviewSubmitted: false,
        totalPrice: 10000,
        headCount: 1,
        date: '2025-10-10',
        startTime: '10:00',
        endTime: '12:00',
        createdAt: '',
        updatedAt: '',
      },
    ],
  };

  //return 전까지는 다 빼도 되지 않을까 싶음
  const handleEventClick = async (ev: CalEvent) => {
    setSelected(ev);

    // 임시로 mock 데이터 사용
    const data = mockReservationsByDate;
    const formattedReservations = data.reservations.map((r) => ({
      nickname: r.nickname,
      people: r.headCount,
      status: r.status === 'declined' ? 'canceled' : r.status,
      time: `${r.startTime}~${r.endTime}`,
      id: r.id,
    }));
    setReservationsForDate(formattedReservations);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelected(null);
  };

  // API 연동으로 받을 항목! async 어쩌고 ..
  const handleApprove = (reservationId: number) => {
    console.log(`예약 ID ${reservationId} 승인`);
  };

  const handleReject = (reservationId: number) => {
    console.log(`예약 ID ${reservationId} 거절`);
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
        defaultDate={new Date(2025, 9, 15)}
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
              time="" // time prop은 ReservationModalBase에서 관리
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
              onApprove={handleApprove}
              onReject={handleReject}
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
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}
        </>
      )}
    </>
  );
}
