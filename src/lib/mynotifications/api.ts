import { BASE_URL } from '@/lib/constants';
import { apiFetch } from '@/lib/auth/apiFetch';
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

  return apiFetch<NotificationList>(
    `${BASE_URL}/my-notifications?${queryString}`
  );
}

//   const response = await fetch(`${BASE_URL}/my-notifications?${queryString}`, {
//     method: 'GET',
//     headers: {
//       Accept: 'application/json',
//       Authorization: `Bearer ${accessToken}`,
//     },
//     cache: 'no-store',
//   });

//   if (!response.ok) {
//     throw new Error('알림 목록을 불러오는 데 실패했습니다.');
//   }

//   const data = await response.json();
//   return data;
// }

/**
 * 알림 삭제
 */
export async function deleteNotification(
  notificationId: number
): Promise<DeleteNotificationRes> {
  return apiFetch<DeleteNotificationRes>(
    `${BASE_URL}/my-notifications/${notificationId}`,
    {
      method: 'DELETE',
    }
  );
}

// if (!response.ok) {
//   throw new Error('알림 삭제에 실패했습니다.');
// }

// const data = await response.json();
// return data;
