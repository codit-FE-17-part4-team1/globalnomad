import {
  type NotificationList,
  type DeleteNotificationRes,
} from '@/types/api/mynotifications';

/**
 * 알림 목록 가져오기
 */
export async function getNotifications(
  cursorId?: number,
  size: number = 10
): Promise<NotificationList> {
  const queryString = cursorId
    ? `cursorId=${cursorId}&size=${size}`
    : `size=${size}`;

  const response = await fetch(`/api/mynotifications?${queryString}`, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('알림 목록을 불러오는 데 실패했습니다.');
  }

  const data = await response.json();
  return data;
}

/**
 * 알림 삭제
 */
export async function deleteNotification(
  notificationId: number
): Promise<DeleteNotificationRes> {
  const response = await fetch(`/api/mynotifications/${notificationId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('알림을 삭제하는 데 실패했습니다.');
  }

  const data = await response.json();
  return data;
}
