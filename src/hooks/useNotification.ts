import { useMemo } from 'react';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import {
  getNotifications,
  deleteNotification,
} from '@/lib/mynotifications/api';
import type { Notification } from '@/types/api/mynotifications';
import type { Alert } from '@/components/Modal/AlertModal';

/**
 * API 응답(Notification)을 UI 모델(Alert)로 변환
 */
function transformNotificationToAlert(notification: Notification): Alert {
  const { id, content, createdAt } = notification;

  const titleMatch = content.match(/^(.*?)\(/);
  const timeMatch = content.match(/\((.*?)\)/);
  const statusMatch = content.match(/예약이 (승인|거절)되었습니다/);

  const title = titleMatch ? titleMatch[1].trim() : '내용 없음';
  const time = timeMatch ? timeMatch[1] : '시간 정보 없음';
  const status = statusMatch ? (statusMatch[1] as '승인' | '거절') : '승인';

  return {
    id,
    title,
    time,
    status,
    createdAt,
  };
}

/**
 * 알림 목록(조회, 삭제) 훅
 */
export default function useNotification(
  size: number = 10,
  currentUserId?: number
) {
  // useInfiniteScroll 사용
  const {
    data: rawNotifications,
    isLoading,
    isError,
    error: scrollError,
    hasMore,
    lastElementRef,
    reset,
  } = useInfiniteScroll<Notification>({
    fetchData: async (cursor) => {
      const cursorId = cursor ? Number(cursor) : undefined;
      const data = await getNotifications(cursorId, size);

      return {
        data: data.notifications,
        nextCursor: data.cursorId ? String(data.cursorId) : null,
      };
    },
    pageSize: size,
  });

  // 현재 사용자의 알림만 필터링 & Alert 형태로 변환
  const notifications = useMemo(() => {
    const filtered = currentUserId
      ? rawNotifications.filter((n) => n.userId === currentUserId)
      : rawNotifications;

    const uniqueNotifications = Array.from(
      new Map(filtered.map((item) => [item.id, item])).values()
    );

    return uniqueNotifications.map(transformNotificationToAlert);
  }, [rawNotifications, currentUserId]);

  // 알림 삭제 후 리셋
  const handleDeleteNotification = async (notificationId: number) => {
    try {
      await deleteNotification(notificationId);
      // 삭제 후 전체 데이터 새로고침
      reset();
    } catch (e) {
      console.error('알림 삭제 실패:', e);
      throw e;
    }
  };

  return {
    notifications,
    isLoading,
    error: isError ? scrollError?.message : undefined,
    hasMore,
    lastElementRef,
    handleDeleteNotification,
    reset,
  };
}
