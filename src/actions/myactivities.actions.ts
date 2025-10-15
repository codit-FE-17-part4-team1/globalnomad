// src/actions/myactivities.actions.ts
'use server';

import {
  getMyActivities,
  getReservationDashboard,
  getReservationsByDate,
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
    // [개발용 임시 코드] 로그인 기능 구현 전까지 임시 토큰을 사용합니다.
    // TODO: 로그인 기능 완성 후 이 블록을 삭제하고 아래 주석을 해제하세요.
    return 'YOUR_TEMPORARY_ACCESS_TOKEN';
    // throw new Error('Not authenticated');
  }
  return token;
}

export async function getMyActivitiesAction(params: {
  cursorId?: number;
  size?: number;
}): Promise<MyActivitiesResponse> {
  const accessToken = await getAccessTokenOrThrow();

  // 서버 액션에서는 앱 로직(권한/캐시/리다이렉트 등) 추가 가능
  const data = await getMyActivities({
    ...params,
    accessToken,
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
  const accessToken = await getAccessTokenOrThrow();
  return getReservationDashboard({
    ...params,
    accessToken,
  });
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
