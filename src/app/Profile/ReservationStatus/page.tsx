// 전체적으로 api 연동 시 코드 수정 필요!

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ReservationCalendar from './_components/ReservationCalendar';
import Header from '@/app/Profile/_components/MypageHeader/MypageHeader';
import ExperienceSelect from '@/app/Profile/ReservationStatus/_components/ExperienceSelect';
import type { Activity, ReservationDashboard } from '@/types/api/myactivities';

// 임시 mock 데이터
const mockActivities: Activity[] = [
  {
    id: 1,
    title: '피오르 체험',
    userId: 1,
    description: '',
    category: '',
    price: 0,
    address: '',
    bannerImageUrl: '',
    rating: 0,
    reviewCount: 0,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 2,
    title: '열기구 페스티벌',
    userId: 1,
    description: '',
    category: '',
    price: 0,
    address: '',
    bannerImageUrl: '',
    rating: 0,
    reviewCount: 0,
    createdAt: '',
    updatedAt: '',
  },
];
const mockDashboardData: ReservationDashboard = [
  {
    date: '2025-10-10',
    reservations: { completed: 0, confirmed: 1, pending: 1 },
  },
  {
    date: '2025-10-15',
    reservations: { completed: 0, confirmed: 0, pending: 1 },
  },
  {
    date: '2025-10-16',
    reservations: { completed: 1, confirmed: 1, pending: 0 },
  },
];

export default function ReservationStatusPage() {
  // const [myActivities, setMyActivities] = useState<Activity[]>([]);
  // const [selectedActivityId, setSelectedActivityId] = useState<number>();
  // const [isLoading, setIsLoading] = useState(true);
  // const [dashboardData, setDashboardData] = useState<ReservationDashboard>([]);
  const [myActivities, setMyActivities] = useState<Activity[]>(mockActivities);
  const [selectedActivityId, setSelectedActivityId] = useState<
    number | undefined
  >(mockActivities[0]?.id);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태를 false로 변경
  const [dashboardData, setDashboardData] =
    useState<ReservationDashboard>(mockDashboardData);

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
      />
      {/* 여기서 조립해야 할 듯? - 체험이 없을 경우를 조건부로! */}
      <div className="h-[560px] md:h-[620px] lg:h-[680px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            Loading...
          </div>
        ) : selectedActivityId ? (
          <ReservationCalendar
            dashboardData={dashboardData}
            activityId={selectedActivityId}
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
