// app/Profile/ReservationStatus/page.tsx
import ReservationCalendar from './_components/ReservationCalendar';
import Header from '@/app/Profile/_components/MypageHeader/MypageHeader';
import CategoryButtons from '@/app/main/_components/CategoryButtons';

export default async function ReservationStatusPage() {
  // 임시로 목데이터 넣어보기

  return (
    <div className="mx-auto max-w-screen-xl ">
      {/* 공통 컴포넌트 적용 - title 유선님 작업하신 거 조립 완료 */}
      <Header title="예약 현황" />
      {/* 카테고리 필터 공통 컴포넌트 적용 필요 */}
      <div>
        <input placeholder="카테고리 선택" className="border" />
      </div>
      <div className="h-[560px] md:h-[620px] lg:h-[680px]">
        <ReservationCalendar />
      </div>
    </div>
  );
}
