import ReservationCalendar from '@/app/Profile/ReservationStatus/_components/ReservationCalendar';

export default function ReservationStatus() {
  return (
    <div>
      <div>{/* 드롭다운 필터 자리 */}</div>
      <div className="mt-10">
        {/* 달력은 컴포넌트로 구성해서 불러와야 한다고 함, 전체적인 틀은 여기서 잡기 (위치 등)*/}
        <ReservationCalendar />
      </div>
    </div>
  );
}
