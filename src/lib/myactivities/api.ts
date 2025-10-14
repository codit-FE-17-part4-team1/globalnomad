// src/lib/api/myactivities/api.ts
import { BASE_API_URL } from '@/lib/constants';
import {
  myactivitiesSchema,
  type MyActivitiesResponse,
} from '@/types/myactivities';

type FetchOpts = { accessToken?: string };

// ---- 내 체험 리스트 조회 ----

export async function getMyActivities(opts: {
  cursorId?: number;
  size?: number;
  accessToken?: string;
}): Promise<MyActivitiesResponse> {
  const { cursorId, size = 20, accessToken } = opts;

  // 이건 무엇?
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
