// src/lib/api/myactivities/api.ts
import { BASE_API_URL } from '@/types/constants';
import {
  myactivitiesSchema,
  reservationsDashboardListSchema,
  reservationsTimeSchema,
  type MyActivitiesResponse,
  type ReservationDashboard,
  type ReservationsTime,
} from '@/types/api/myactivities';

export async function getMyActivities(opts: {
  cursorId?: number;
  size?: number;
  accessToken?: string;
}): Promise<MyActivitiesResponse> {
  const { cursorId, size = 20, accessToken } = opts;

  const qs = new URLSearchParams();
  if (cursorId != null) qs.set('cursorId', String(cursorId));
  qs.set('size', String(size));

  const res = await fetch(`${BASE_API_URL}/my-activities?${qs.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error('내 체험 목록을 불러오는 데 실패했습니다.');
  }

  const data = await res.json();
  return myactivitiesSchema.parse(data);
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
  const res = await fetch(
    `${BASE_API_URL}/my-activities/${activityId}/reservation-dashboard?year=${year}&month=${month}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('월별 예약 현황을 불러오는 데 실패했습니다.');
  }

  const data = await res.json();
  return reservationsDashboardListSchema.parse(data);
}

/**
 * 내 체험 날짜별 예약 정보 조회
 */
export async function getReservationsByDate(opts: {
  activityId: number;
  date: string; // YYYY-MM-DD
  accessToken?: string;
}): Promise<ReservationsTime> {
  const { activityId, date, accessToken } = opts;
  // 참고: API 명세에 따라 cursorId, size 등의 파라미터 추가가 필요할 수 있습니다.
  const res = await fetch(
    `${BASE_API_URL}/my-activities/${activityId}/reservations?date=${date}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error('날짜별 예약 정보를 불러오는 데 실패했습니다.');
  }
  const data = await res.json();
  return reservationsTimeSchema.parse(data);
}
