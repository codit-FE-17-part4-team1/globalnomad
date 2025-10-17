import { useState, useEffect } from 'react';
import {
  getMyActivities,
  getReservationDashboard,
} from '@/lib/myactivities/api';
import type { Activity, ReservationDashboard } from '@/types/api/myactivities';

// 해당 커스텀 훅의 목적:
// 1. 체험목록(getMyActivities)을 가져와서 달력에 상태에 맞게 표시해줘야 함 (getReservationDashboard)
// 2. 체험명 (activityId를 가져와서) ExperienceSelect로 전달해줘야 함

/**
 * 예약 현황 페이지의 상태 및 비즈니스 로직 관리
 */
export default function useReservationsDashboard(accessToken?: string) {
  // 1. 내 체험 목록 상태 관리
  const [myActivities, setMyActivities] = useState<Activity[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [activitiesError, setActivitiesError] = useState<string | null>(null);

  // 2. 선택된 체험 및 예약 현황(대시보드) 상태 관리
  const [selectedActivityId, setSelectedActivityId] = useState<
    number | undefined
  >();
  const [dashboardData, setDashboardData] = useState<ReservationDashboard>([]);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  // 3. 캘린더 날짜 상태 관리
  const [currentDate, setCurrentDate] = useState(new Date());

  // 내 체험 목록 가져와서 보여주기
  useEffect(() => {
    if (!accessToken) {
      setIsLoadingActivities(false);
      return;
    }

    const fetchMyActivities = async () => {
      try {
        setIsLoadingActivities(true);
        const response = await getMyActivities({ accessToken });
        setMyActivities(response.activities);
        // 체험 목록을 불러온 후 첫번째 체험을 자동으로 선택
        if (response.activities.length > 0) {
          setSelectedActivityId(response.activities[0].id);
        }
      } catch (e) {
        setActivitiesError(e instanceof Error ? e.message : String(e));
      } finally {
        setIsLoadingActivities(false);
      }
    };

    fetchMyActivities();
  }, [accessToken]);

  // 월별 예약 현황
  // 로그인 불가 또는 선택된 체험이 없을 경우
  useEffect(() => {
    if (!accessToken || !selectedActivityId) {
      setDashboardData([]);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setIsLoadingDashboard(true);
        setDashboardError(null);
        const year = String(currentDate.getFullYear());
        const month = String(currentDate.getMonth() + 1);
        const response = await getReservationDashboard({
          accessToken,
          activityId: selectedActivityId,
          year,
          month,
        });
        setDashboardData(response);
      } catch (e) {
        setDashboardError(e instanceof Error ? e.message : String(e));
      } finally {
        setIsLoadingDashboard(false);
      }
    };

    fetchDashboardData();
  }, [accessToken, selectedActivityId, currentDate]);

  return {
    myActivities,
    isLoadingActivities,
    selectedActivityId,
    setSelectedActivityId,
    dashboardData,
    isLoadingDashboard,
    setCurrentDate,
  };
}
