// src/actions/myactivities.actions.ts
'use server';

import { cookies } from 'next/headers';
import type {
  MyActivitiesResponse,
  ReservationDashboard,
} from '@/types/myactivities';

function getAccessTokenOrThrow() {
  const token = cookies().get('accessToken')?.value;
  if (!token) throw new Error('Not authenticated');
  return token;
}

export async function getMyActivitiesAction(params: {
  cursorId?: number;
  size?: number;
}): Promise<MyActivitiesResponse> {
  const accessToken = getAccessTokenOrThrow();

  // 서버 액션에서는 앱 로직(권한/캐시/리다이렉트 등) 추가 가능
  const data = await fetchMyActivities({
    ...params,
    accessTokenOverride: accessToken,
  });

  // 예: 상태 변경 뒤 목록 무효화
  // revalidateTag('my-activities:list');

  return data;
}

export async function getReservationDashboardAction(params: {
  teamId: string;
  activityId: number;
  year: string;
  month: string;
}): Promise<ReservationDashboard> {
  const accessToken = getAccessTokenOrThrow();
  return fetchReservationDashboard({
    ...params,
    accessTokenOverride: accessToken,
  });
}
