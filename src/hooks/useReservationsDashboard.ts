import { useState, useEffect } from 'react';
import {
  getMyActivities,
  getReservationDashboard,
  getReservationsByDate,
} from '@/lib/myactivities/api';
import type {
  Activity,
  ReservationDashboard,
  ReservationsTime,
} from '@/types/api/myactivities';

// 해당 커스텀 훅의 목적을 설정해보자면..:
// 1. 체험목록(getMyActivities)을 가져와서 달력에 상태에 맞게 표시해줘야 함 (getReservationDashboard)
// 2. 체험명 (activityId를 가져와서) ExperienceSelect로 전달해줘야 함
// 3. 날짜 클릭 시 해당 날짜의 예약 정보를 가져와야 함 (getReservationsByDate)

const today = new Date();
/**
 * 예약 현황 페이지의 상태 및 비즈니스 로직 관리
 */
export default function useReservationsDashboard() {
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

  // 4. 날짜별 예약 목록 상태 관리
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [reservationsForDate, setReservationsForDate] =
    useState<ReservationsTime | null>(null);
  const [isLoadingReservations, setIsLoadingReservations] = useState(false);
  const [reservationsError, setReservationsError] = useState<string | null>(
    null
  );

  // 내 체험 목록 가져와서 보여주기
  useEffect(() => {
    const fetchMyActivities = async () => {
      try {
        setIsLoadingActivities(true);
        const response = await getMyActivities({});
        setMyActivities(response.activities);
        // 체험 목록을 불러온 후 첫번째 체험을 자동으로 선택
        if (response.activities.length > 0) {
          setSelectedActivityId(response.activities[0].id);
        } else {
          // 체험이 없으면 대시보드 데이터도 없음
          setDashboardData([]);
          setSelectedActivityId(undefined);
        }
      } catch (e) {
        setActivitiesError(e instanceof Error ? e.message : String(e));
        console.log(e);
      } finally {
        setIsLoadingActivities(false);
      }
    };

    fetchMyActivities();
  }, []);

  // 월별 예약 현황
  // 선택된 체험이 없을 경우
  useEffect(() => {
    if (!selectedActivityId) {
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
  }, [selectedActivityId, currentDate]);

  // 날짜별 예약 정보 조회
  useEffect(() => {
    if (!selectedActivityId || !selectedDate) {
      return;
    }

    const fetchReservationsByDate = async () => {
      try {
        setIsLoadingReservations(true);
        setReservationsError(null);
        const response = await getReservationsByDate({
          activityId: selectedActivityId,
          date: selectedDate,
        });
        setReservationsForDate(response);
      } catch (e) {
        setReservationsError(e instanceof Error ? e.message : String(e));
      } finally {
        setIsLoadingReservations(false);
      }
    };

    fetchReservationsByDate();
  }, [selectedActivityId, selectedDate]);

  // 캘린더에서 날짜 선택 시 호출될 핸들러 -> 날짜를 클릭하면 모달이 나와야 할 것 같아 겹치는 것 같은데 .. 흠
  const handleDateSelect = (date: string | null) => {
    setSelectedDate(date);
  };

  // 날짜별 예약 정보 로딩이 완료된 후 실행할 콜백
  useEffect(() => {
    // selectedDate가 있고, 로딩이 끝났으며, 데이터가 준비되었을 때
    if (selectedDate && !isLoadingReservations && reservationsForDate) {
      // 이 로직은 ReservationCalendar에서 모달을 열기 위해 사용됩니다.
      // 현재는 특별한 동작이 필요 없지만, 향후 확장성을 위해 구조를 유지합니다.
      // 예를 들어, 여기서 모달을 열라는 신호를 보낼 수 있습니다.
      // onDataLoaded?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingReservations, reservationsForDate]);

  return {
    myActivities,
    isLoadingActivities,
    selectedActivityId,
    setSelectedActivityId,
    dashboardData,
    isLoadingDashboard,
    setCurrentDate,
    reservationsForDate,
    isLoadingReservations,
    reservationsError,
    handleDateSelect,
    selectedDate,
    activitiesError,
    dashboardError,
    currentDate,
  };
}
