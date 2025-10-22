import { BASE_URL } from '@/lib/constants';
import {
  type MyActivitiesResponse,
  type ReservationDashboard,
  type ReservedSchedule,
  type ReservationsTime,
  type Activity,
  type Reservation,
} from '@/types/api/myactivities';

/**
 * 내 체험 목록
 */
export async function getMyActivities(opts: {
  cursorId?: number;
  size?: number;
  accessToken?: string;
}): Promise<MyActivitiesResponse> {
  const { cursorId, size = 20, accessToken } = opts;

  // assertToken(accessToken);

  const qs = new URLSearchParams();
  if (cursorId != null) qs.set('cursorId', String(cursorId));
  qs.set('size', String(size));

  const url = `${BASE_URL}/my-activities?${qs.toString()}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('내 체험 목록을 불러오는 데 실패했습니다.');

  const data = await res.json();
  return data;
}

/**
 * 내 체험 월별 예약 현황 조회
 */
export async function getReservationDashboard(opts: {
  activityId: number;
  year: string;
  month: string;
  accessToken?: string;
}): Promise<ReservationDashboard> {
  const { activityId, year, month, accessToken } = opts;
  // assertToken(accessToken);

  const url = `${BASE_URL}/my-activities/${activityId}/reservation-dashboard?year=${year}&month=${month}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('월별 예약 현황을 불러오는 데 실패했습니다.');
  }

  const data = await res.json();
  return data;
}

/**
 * 내 체험 날짜별 예약 정보 조회 (특정 날짜의 시간대 목록 조회)
 */
export async function getSchedulesForDate(opts: {
  activityId: number;
  date: string;
  accessToken?: string;
}): Promise<ReservedSchedule> {
  const { activityId, date, accessToken } = opts;
  // assertToken(accessToken);

  const dateObj = new Date(date);
  const year = String(dateObj.getFullYear());
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');

  const url = `${BASE_URL}/my-activities/${activityId}/reserved-schedule?date=${date}`;
  console.log('🔗 Request URL:', url); // --> 콘솔 확인됨
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    if (res.status === 404 || res.status === 400) {
      return [];
    }
    throw new Error('예약 스케줄을 불러오는 데 실패했습니다.');
  }

  const data = await res.json();
  return data;
}

export async function getReservationsBySchedule(opts: {
  activityId: number;
  scheduleId: number;
  status?: 'pending' | 'confirmed' | 'declined';
  accessToken?: string;
}): Promise<ReservationsTime> {
  const { activityId, scheduleId, status, accessToken } = opts;

  // assertToken(accessToken);

  const params = new URLSearchParams();
  params.set('scheduleId', String(scheduleId));

  if (status) {
    params.set('status', status);
  }

  console.log('🔗 Request params:', { scheduleId, status });

  const url = `${BASE_URL}/my-activities/${activityId}/reservations?${params.toString()}`;

  console.log('🔗 Request URL:', url);

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  console.log('📡 Response status:', res.status);

  if (!res.ok) {
    const errorText = await res.text();
    console.error('❌ Error response:', errorText);

    if (res.status === 404 || res.status === 400) {
      return { reservations: [], totalCount: 0, cursorId: null };
    }
    throw new Error('예약 정보를 불러오는 데 실패했습니다.');
  }

  const data = await res.json();
  console.log('📦 Reservation data:', data);

  return data;
}

export async function getReservationsByDate(opts: {
  activityId: number;
  date: string;
  accessToken?: string;
}): Promise<ReservationsTime> {
  const { activityId, date, accessToken } = opts;

  console.log('🔍 Fetching reservations for date:', date); // --> 콘솔 확인됨

  try {
    // 1. 해당 월의 스케줄 가져오기
    const allSchedules = await getSchedulesForDate({
      activityId,
      date,
      accessToken,
    });

    console.log('📅 Schedules found:', allSchedules.length); // --> 콘솔 확인됨

    if (allSchedules.length === 0) {
      return {
        reservations: [],
        totalCount: 0,
        cursorId: null,
      };
    }

    // 2. 예약이 있는 스케줄만 필터링
    const schedulesWithReservations = allSchedules.filter(
      (schedule) =>
        schedule.count.pending > 0 ||
        schedule.count.confirmed > 0 ||
        schedule.count.declined > 0
    );

    console.log(
      '✅ Schedules with reservations:',
      schedulesWithReservations.length
    ); // --> 콘솔 확인됨

    if (schedulesWithReservations.length === 0) {
      return {
        reservations: [],
        totalCount: 0,
        cursorId: null,
      };
    }

    // 3. 각 스케줄의 예약자 정보 가져오기
    const reservationPromises = schedulesWithReservations.flatMap(
      (schedule) => {
        const promises = [];

        // pending 예약이 있으면 조회
        if (schedule.count.pending > 0) {
          promises.push(
            getReservationsBySchedule({
              activityId,
              scheduleId: schedule.scheduleId,
              status: 'pending',
              accessToken,
            })
          );
        }

        // confirmed 예약이 있으면 조회
        if (schedule.count.confirmed > 0) {
          promises.push(
            getReservationsBySchedule({
              activityId,
              scheduleId: schedule.scheduleId,
              status: 'confirmed',
              accessToken,
            })
          );
        }

        // declined 예약이 있으면 조회
        if (schedule.count.declined > 0) {
          promises.push(
            getReservationsBySchedule({
              activityId,
              scheduleId: schedule.scheduleId,
              status: 'declined',
              accessToken,
            })
          );
        }

        return promises;
      }
    );

    const reservationArrays = await Promise.all(reservationPromises);
    const allReservations = reservationArrays.flat();

    console.log('🎉 Total reservations:', allReservations.length); // --> 확인 불가
    console.log('🎉 Reservations detail:', allReservations);

    return {
      reservations: allReservations,
      totalCount: allReservations.length,
      cursorId: null,
    };
  } catch (error) {
    console.error('❌ Failed to fetch reservations:', error);

    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }

    return {
      reservations: [],
      totalCount: 0,
      cursorId: null,
    };
  }
}

/**
 * 내 체험 예약 상태(승인,거절) 업데이트
 */
export async function updateReservationStatus(opts: {
  activityId: number;
  reservationId: number;
  status: 'confirmed' | 'declined';
  accessToken?: string;
}): Promise<void> {
  const { activityId, reservationId, status, accessToken } = opts;
  // assertToken(accessToken);

  const url = `${BASE_URL}/my-activities/${activityId}/reservations/${reservationId}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ status }),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('예약 상태 업데이트에 실패했습니다.');
  }
}

/**
 * 내 체험 삭제
 */
export async function deleteMyActivity(opts: {
  activityId: number;
  accessToken?: string;
}): Promise<void> {
  const { activityId, accessToken } = opts;
  // assertToken(accessToken);

  const url = `${BASE_URL}/my-activities/${activityId}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('체험 삭제에 실패했습니다.');
  }
}

/**
 * 내 체험 수정
 */
export async function modifyMyActivity(
  activityId: number,
  formData: FormData,
  accessToken: string
): Promise<Activity> {
  // assertToken(accessToken);
  const url = `${BASE_URL}/my-activities/${activityId}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: formData,
  });

  if (!res.ok) throw new Error('체험 수정에 실패했습니다.');

  const data = await res.json();
  // 수정 후 업데이트된 activity 정보를 반환한다고 가정
  return data;
}
