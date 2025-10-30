// 해당 코드 리펙토링 및 삭제 필요 (에러 화면 등)

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ReservationCalendar from './_components/ReservationCalendar';
import Header from '@/app/Profile/_components/MypageHeader/MypageHeader';
import ExperienceSelect from '@/app/Profile/ReservationStatus/_components/ExperienceSelect';
import useReservationsDashboard from '@/hooks/useReservationsDashboard';
import useReservationsStatus from '@/hooks/useReservationsStatus';
import { ensureRefreshed } from '@/lib/auth/apiFetch';
import ConfirmModal from '@/components/Modal/ConfirmModal';

export default function ReservationStatusPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await ensureRefreshed();

        if (authenticated) {
          setIsAuthenticated(true);
          setIsAuthChecking(false);
        } else {
          setAuthError(
            '인증에 실패했습니다. ensureRefreshed가 false를 반환했습니다.'
          );
          setIsAuthChecking(false);
          window.location.href = '/'; // 인증 불가일 경우 메인페이지로 이동되도록 !
        }
      } catch (error) {
        console.error('❌ 인증 체크 에러:', error); // ✅ 수정
        setAuthError(
          `인증 체크 중 에러 발생: ${error instanceof Error ? error.message : '알 수 없는 에러'}`
        );
        setIsAuthChecking(false);
        window.location.href = '/'; // 인증 불가일 경우 메인페이지로 이동되도록 !
      }
    };
    checkAuth();
  }, []);

  if (isAuthChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">checking...</div>
      </div>
    );
  }

  return <AuthenticatedContent />;
}

// 인증 기능 구현 후 실제 accessToken 연결 필요
function AuthenticatedContent() {
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
    refreshDashboard,
  } = useReservationsDashboard();

  const { handleUpdateStatus, isUpdating, updateError } = useReservationsStatus(
    selectedActivityId,
    refreshDashboard
  );

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    message: '',
  });

  const handleApprove = (reservationId: number) => {
    handleUpdateStatus(reservationId, 'confirmed', async () => {
      if (selectedDate) {
        await handleDateSelect(selectedDate); // 모달 내용 갱신
        refreshDashboard(); // 달력 카운트 갱신
      }
      setConfirmModal({ isOpen: true, message: '승인이 완료되었습니다.' });
    });
  };

  const handleReject = (reservationId: number) => {
    handleUpdateStatus(reservationId, 'declined', async () => {
      if (selectedDate) {
        await handleDateSelect(selectedDate); // 모달 내용 갱신
        refreshDashboard(); // 달력 카운트 갱신
      }
      setConfirmModal({ isOpen: true, message: '거절이 완료되었습니다.' });
    });
  };

  const handleConfirmModalClose = () => {
    setConfirmModal({ isOpen: false, message: '' });
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
          <div className="flex flex-col items-center pt-50 h-full text-2xl font-medium text-gray-700">
            <Image
              src="/images/empty.svg"
              alt="체험없음"
              width={200}
              height={200}
              className="md:w-[240px] md:h-[240px]"
            />
            아직 등록한 체험이 없어요.
          </div>
        )}
      </div>
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={handleConfirmModalClose}
        message={confirmModal.message}
        className="bg-white"
      />
    </div>
  );
}
