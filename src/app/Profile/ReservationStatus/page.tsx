'use client';

import Image from 'next/image';
import ReservationCalendar from './_components/ReservationCalendar';
import Header from '@/app/Profile/_components/MypageHeader/MypageHeader';
import ExperienceSelect from '@/app/Profile/ReservationStatus/_components/ExperienceSelect';
// import AlertModal from '@/components/Modal/AlertModal'; // 임시
// 훅 추가
import useReservationsDashboard from '@/hooks/useReservationsDashboard';
import useReservationsStatus from '@/hooks/useReservationsStatus';

export default function ReservationStatusPage() {
  // 인증 기능 구현 후 실제 accessToken 연결 필요
  const accessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjcwNCwidGVhbUlkIjoiMTctMSIsImlhdCI6MTc2MTIyNTQ1NiwiZXhwIjoxNzYxMjI3MjU2LCJpc3MiOiJzcC1nbG9iYWxub21hZCJ9.bs1WnH2IUpx9LFH3ImqqsAgLYXdHGqe3Bk0vBbetvrA';
  const {
    myActivities,
    isLoadingActivities,
    selectedActivityId,
    setSelectedActivityId,
    dashboardData,
    isLoadingDashboard,
    setCurrentDate,
    reservationsForDate,
    isLoadingReservations,
    handleDateSelect,
    selectedDate,
    currentDate,
  } = useReservationsDashboard(accessToken);

  const { handleUpdateStatus, isUpdating, updateError } = useReservationsStatus(
    accessToken,
    selectedActivityId
  );

  // 승인, 거절 시 상태값 업데이트 되는 함수로 호출을 했는데, 왜 자동으로 다른 게 거절됨?
  const handleApprove = (reservationId: number) => {
    handleUpdateStatus(reservationId, 'confirmed', () => {
      if (selectedDate) handleDateSelect(selectedDate);
    });
  };

  const handleReject = (reservationId: number) => {
    handleUpdateStatus(reservationId, 'declined', () => {
      if (selectedDate) handleDateSelect(selectedDate);
    });
  };

  return (
    <div className="mx-auto max-w-screen-xl ">
      {/* 공통 컴포넌트 적용 - title 유선님 작업하신 거 조립 완료 */}
      <Header title="예약 현황" />
      {/* 카테고리 필터 공통 컴포넌트 적용 필요 - 따로 생성해서 조립 완료! */}
      <ExperienceSelect
        experiences={myActivities}
        selectedExperienceId={selectedActivityId}
        onSelectExperience={setSelectedActivityId}
      />
      {/* 여기서 조립해야 할 듯? - 체험이 없을 경우를 조건부로! */}
      <div className="h-[560px] md:h-[620px] lg:h-[680px]">
        {isLoadingActivities || isLoadingDashboard ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            Loading...
          </div>
        ) : selectedActivityId ? (
          <ReservationCalendar
            dashboardData={dashboardData}
            activityId={selectedActivityId}
            currentDate={currentDate}
            onNavigate={(newDate) => setCurrentDate(newDate)}
            onSelectDate={handleDateSelect}
            reservationsForDate={reservationsForDate}
            isLoadingReservations={isLoadingReservations || isUpdating}
            onApprove={handleApprove}
            onReject={handleReject}
            updateError={updateError}
          />
        ) : (
          <div className="flex flex-col items-center mt-50 h-full text-gray-500">
            <Image
              src="/images/empty.svg"
              alt="체험없음"
              width={150}
              height={150}
            />
            아직 등록한 체험이 없어요.
          </div>
        )}
      </div>
    </div>
  );
}
