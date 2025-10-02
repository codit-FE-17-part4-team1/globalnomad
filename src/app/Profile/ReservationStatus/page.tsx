// app/Profile/ReservationStatus/page.tsx
import ReservationCalendar from './_components/ReservationCalendar';
import type { CalEvent } from '@/types/calendar';

export default async function ReservationStatusPage() {
  // 임시로 목데이터 넣어보기
  const mock: CalEvent[] = [
    {
      id: 'e1',
      title: '피오르 체험',
      start: new Date(2025, 1, 10, 10),
      end: new Date(2025, 1, 10, 12),
      place: '홍대 스튜디오',
      tone: 'blue',
      status: 'confirmed', // 승인
    },
    {
      id: 'e2',
      title: '열기구 페스티벌',
      start: new Date(2025, 1, 11, 14),
      end: new Date(2025, 1, 12, 12),
      place: '성수',
      tone: 'beige',
      status: 'pending', // 신청
    },
  ];

  return (
    <div className="mx-auto max-w-screen-xl ">
      {/* 공통 컴포넌트 적용 전 임시 진행, title + filter */}
      <h1 className="mb-6 text-2xl font-bold">예약 현황</h1>
      <div>
        <input placeholder="카테고리 선택" className="border" />
      </div>
      <div className="h-[560px] md:h-[620px] lg:h-[680px]">
        <ReservationCalendar events={mock} />
      </div>
    </div>
  );
}
