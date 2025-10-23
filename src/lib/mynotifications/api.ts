import { BASE_URL } from '@/lib/constants';
import {
  notificationListSchema,
  deleteNotificationResZ,
  type NotificationList,
  type DeleteNotificationRes,
} from '@/types/api/mynotifications';

/**
 * 알림 목록 가져오기
 */
export async function getNotifications(
  cursorId?: number,
  size: number = 10,
  accessToken?: string
): Promise<NotificationList> {
  console.log('🔑 getNotifications - accessToken:', accessToken);
  console.log('🔑 accessToken 길이:', accessToken?.length);

  const queryString = cursorId
    ? `cursorId=${cursorId}&size=${size}`
    : `size=${size}`;

  const response = await fetch(`${BASE_URL}/my-notifications?${queryString}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  console.log('📡 응답 상태 코드:', response.status); // 🔥 중요!
  console.log('📡 응답 ok?:', response.ok); // 🔥 중요!

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ 에러 응답 내용:', errorText); // 🔥 이게 핵심!
    console.error('❌ 응답 상태:', response.status);
    console.error('❌ 응답 statusText:', response.statusText);

    throw new Error(
      '알림 목록을 불러오는 데 실패했습니다. (${response.status})'
    );
  }

  const data = await response.json();
  console.log('✅ 성공 응답 데이터:', data); // 추가
  return data;
}

/**
 * 알림 삭제
 */
export async function deleteNotification(
  notificationId: number,
  accessToken?: string
): Promise<DeleteNotificationRes> {
  const response = await fetch(
    `${BASE_URL}/my-notifications/${notificationId}`,
    {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    throw new Error('알림 삭제에 실패했습니다.');
  }

  const data = await response.json();
  return data;
}
