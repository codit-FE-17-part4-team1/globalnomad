import { BASE_API_URL } from '@/types/constants';
import {
  myactivitiesSchema,
  reservationsDashboardListSchema,
  reservationsTimeSchema,
  updateReservationStatusSchema,
  modifyActivitySchema,
  activitySchema,
  type MyActivitiesResponse,
  type ReservationDashboard,
  type ReservationsTime,
  type UpdateReservationStatus,
  type Activity,
} from '@/types/api/myactivities';

function assertToken(token?: string): asserts token is string {
  if (!token)
    throw new Error('인증 토큰이 없습니다. 로그인 후 다시 시도해 주세요.');
}

/**
 * 내 체험 목록
 */
export async function getMyActivities(opts: {
  cursorId?: number;
  size?: number;
  accessToken?: string;
}): Promise<MyActivitiesResponse> {
  const { cursorId, size = 20, accessToken } = opts;

  assertToken(accessToken);

  const qs = new URLSearchParams();
  if (cursorId != null) qs.set('cursorId', String(cursorId));
  qs.set('size', String(size));

  const url = `${BASE_API_URL}/my-activities?${qs.toString()}`;
  console.log(url);
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  console.log(res);

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
  assertToken(accessToken);

  const url = `${BASE_API_URL}/my-activities/${activityId}/reservation-dashboard?year=${year}&month=${month}`;
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
 * 내 체험 날짜별 예약 정보 조회
 */
export async function getReservationsByDate(opts: {
  activityId: number;
  date: string; // YYYY-MM-DD
  accessToken?: string;
}): Promise<ReservationsTime> {
  const { activityId, date, accessToken } = opts;
  assertToken(accessToken);

  const url = `${BASE_API_URL}/my-activities/${activityId}/reservations?date=${date}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('날짜별 예약 정보를 불러오는 데 실패했습니다.');
  }

  const data = await res.json();
  return reservationsTimeSchema.parse(data); // 이건 날짜별이 아니라 시간대별인데다, status도 신청,승인,거절을 모두 받아서 넘겨줘야 함  --> 다시 수정 필요?
}

/**
 * 내 체험 예약 시간대별 예약 조회
 */
// export async function getReservationsByTime(opts: {
//   activityId: number;
//   scheduleId: number;
//   status: string;
//   accessToken?: string;
// }): Promise<ReservationsTime> {
//   const { activityId, scheduleId, status, accessToken } = opts;
//   assertToken(accessToken);

// }

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
  assertToken(accessToken);

  const url = `${BASE_API_URL}/my-activities/${activityId}/reservations/${reservationId}`;
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
  assertToken(accessToken);

  const url = `${BASE_API_URL}/my-activities/${activityId}`;
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
 * 참고: 체험 수정은 FormData를 사용할 가능성이 높아, customFetch 대신 직접 fetch를 사용
 * 파일 업로드가 포함된 경우 body는 FormData 객체가 되어야 함
 */
export async function modifyMyActivity(
  activityId: number,
  formData: FormData,
  accessToken: string
): Promise<Activity> {
  assertToken(accessToken);
  const url = `${BASE_API_URL}/my-activities/${activityId}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: formData,
  });

  if (!res.ok) throw new Error('체험 수정에 실패했습니다.');

  const data = await res.json();
  // 수정 후 업데이트된 activity 정보를 반환한다고 가정
  return activitySchema.parse(data);
}
