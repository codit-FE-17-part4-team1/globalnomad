// src/actions/myactivities.actions.ts
'use server';

import {
  getMyActivities,
  getReservationDashboard,
  getReservationsByDate,
  updateReservationStatus,
} from '@/lib/myactivities/api';
import { cookies } from 'next/headers';
import type {
  MyActivitiesResponse,
  ReservationDashboard,
  ReservationsTime,
} from '@/types/api/myactivities';

async function getAccessTokenOrThrow() {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;
  if (!token) {
    // 로그인 기능 완성되면 삭제 예정
    // TODO: 로그인 기능 완성 후 아래 코드는 삭제하고 throw new Error를 활성화하세요.
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjY4OSwidGVhbUlkIjoiMTctMSIsImlhdCI6MTc2MDUyNTE5MCwiZXhwIjoxNzYxNzM0NzkwLCJpc3MiOiJzcC1nbG9iYWxub21hZCJ9.OltJ5EMC31UvEAeBDEkiJCUNDmM_0cTbACyft6nHAPc';
    // throw new Error('Not authenticated'); // 실제 프로덕션에서는 이 코드를 사용해야 합니다.
  }
  return token;
}

export async function getMyActivitiesAction(params: {
  cursorId?: number;
  size?: number;
}): Promise<MyActivitiesResponse> {
  try {
    const accessToken = await getAccessTokenOrThrow();
    const data = await getMyActivities({ ...params, accessToken });
    return data;
  } catch (e: any) {
    console.error('[getMyActivitiesAction] error:', e?.message || e);
    // 필요하면 e.message를 그대로 throw 해도 됨
    throw new Error(
      '내 체험 목록을 불러오는 데 실패했습니다. (상세는 서버 로그 참고)'
    );
  }
}

export async function getReservationDashboardAction(params: {
  teamId: string;
  activityId: number;
  year: string;
  month: string;
}): Promise<ReservationDashboard> {
  const accessToken = await getAccessTokenOrThrow();
  return getReservationDashboard({
    ...params,
    accessToken,
  });
}

export async function updateReservationStatusAction(params: {
  activityId: number;
  reservationId: number;
  status: 'confirmed' | 'declined';
}): Promise<void> {
  const accessToken = await getAccessTokenOrThrow();
  await updateReservationStatus({
    ...params,
    accessToken,
  });
  // TODO: revalidatePath 또는 revalidateTag를 호출하여 관련 페이지 캐시를 무효화해야 합니다.
}

export async function getReservationsByDateAction(params: {
  activityId: number;
  date: string; // YYYY-MM-DD
}): Promise<ReservationsTime> {
  const accessToken = await getAccessTokenOrThrow();
  return getReservationsByDate({
    ...params,
    accessToken,
  });
}
