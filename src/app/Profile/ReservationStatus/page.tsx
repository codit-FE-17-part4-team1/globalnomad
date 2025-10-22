// 전체적으로 api 연동 시 코드 수정 필요!

'use client';

import Image from 'next/image';
import ReservationCalendar from './_components/ReservationCalendar';
import Header from '@/app/Profile/_components/MypageHeader/MypageHeader';
import ExperienceSelect from '@/app/Profile/ReservationStatus/_components/ExperienceSelect';
// 훅 추가
import useReservationsDashboard from '@/hooks/useReservationsDashboard';
import useReservationsStatus from '@/hooks/useReservationsStatus';

export default function ReservationStatusPage() {
  // 인증 기능 구현 후 실제 accessToken 연결 필요
  const accessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjcwNCwidGVhbUlkIjoiMTctMSIsImlhdCI6MTc2MTE1OTI4NywiZXhwIjoxNzYxMTYxMDg3LCJpc3MiOiJzcC1nbG9iYWxub21hZCJ9.c3ME32B-4MVPNB6vt55JRc232FJgXTOh1PSLbPSIXQc';
  // props로 받기?
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

  // 중복되는 값이 있는 것 같아서 제거하고 단순화로 진행
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
      {/* 임시 확인, 나중에 알림 이모티콘? 에 연결할 예정 - 알림이 없을 경우도 조건부로? --> 근데 이 페이지에서 작업하는게 아닌 것 같음(공통이라서) */}
      {/* <AlertModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        alerts={mockAlerts}
      /> */}

      {/* 공통 컴포넌트 적용 - title 유선님 작업하신 거 조립 완료 */}
      <Header title="예약 현황" />
      {/* 카테고리 필터 공통 컴포넌트 적용 필요 - 따로 생성해서 조립 완료! */}
      <ExperienceSelect
        experiences={myActivities}
        selectedExperienceId={selectedActivityId}
        onSelectExperience={setSelectedActivityId}
        // onClick={handleOverLayClick}
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
