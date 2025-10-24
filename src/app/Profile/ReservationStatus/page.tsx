'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ReservationCalendar from './_components/ReservationCalendar';
import Header from '@/app/Profile/_components/MypageHeader/MypageHeader';
import ExperienceSelect from '@/app/Profile/ReservationStatus/_components/ExperienceSelect';
import useReservationsDashboard from '@/hooks/useReservationsDashboard';
import useReservationsStatus from '@/hooks/useReservationsStatus';
import { ensureRefreshed } from '@/lib/auth/apiFetch';

export default function ReservationStatusPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null); // ✅ 에러 상태 추가

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
          // window.location.href = '/'; // 인증 불가일 경우 메인페이지로 이동되도록 !
        }
      } catch (error) {
        console.error('❌ 인증 체크 에러:', error); // ✅ 수정
        setAuthError(
          `인증 체크 중 에러 발생: ${error instanceof Error ? error.message : '알 수 없는 에러'}`
        );
        setIsAuthChecking(false);
        // window.location.href = '/'; // 인증 불가일 경우 메인페이지로 이동되도록 !
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

  if (authError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="text-red-500 text-xl">❌ 인증 실패</div>
        <div className="text-gray-700 max-w-md text-center bg-gray-100 p-4 rounded">
          {authError}
        </div>
        <div className="text-sm text-gray-500">
          콘솔을 확인하여 로그를 봐주세요
        </div>
        <button
          onClick={() => (window.location.href = '/Login')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          로그인 페이지로 이동
        </button>
      </div>
    );
  }

  // ✅ 인증 실패 시
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="text-yellow-500 text-xl">⚠️ 미인증 상태</div>
        <div className="text-gray-700">
          인증되지 않았지만 에러는 발생하지 않았습니다.
        </div>
        <button
          onClick={() => (window.location.href = '/Login')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          로그인 페이지로 이동
        </button>
      </div>
    );
  }

  return <AuthenticatedContent />;
}

// // 인증 기능 구현 후 실제 accessToken 연결 필요
// const accessToken =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjcwNCwidGVhbUlkIjoiMTctMSIsImlhdCI6MTc2MTI5NTk4NCwiZXhwIjoxNzYxMjk3Nzg0LCJpc3MiOiJzcC1nbG9iYWxub21hZCJ9.-N4erHMJ1Gz9D-6wT_CtsdSNDrQwgUvyZpF4Kl6Qpx8';
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
  } = useReservationsDashboard();

  const { handleUpdateStatus, isUpdating, updateError } =
    useReservationsStatus(selectedActivityId);

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
