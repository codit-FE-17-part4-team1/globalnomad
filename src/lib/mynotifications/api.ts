import { BASE_URL } from '@/lib/constants';
import {
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

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error('알림 목록을 불러오는 데 실패했습니다. ${errorText}');
  }

  const data = await response.json();
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
