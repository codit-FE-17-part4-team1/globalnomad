// 해당 훅은 GET, DELETE를 통해 데이터를 가져온 후에 삭제하기
// api 함수를 가져와서 UI 에 전달해줘야 하는 건데,

import { useState, useCallback, useEffect } from 'react';
import {
  getNotifications,
  deleteNotification,
} from '@/lib/mynotifications/api';
import type { Notification } from '@/types/api/mynotifications';
import type { Alert } from '@/components/Modal/AlertModal';

/**
 * API 응답(Notification)을 UI 모델(Alert)로 변환
 * "코인 노래방(2025-10-24 12:00~13:00) 예약이 거절되었습니다." 형식의 문자열을 파싱
 * @param notification API에서 받은 알림 객체
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
 * 알림 목록(조회, 삭제)
 * @param size 한번에 불러올 알림 개수
 */
export default function useNotification(size: number = 10) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cursorId, setCursorId] = useState<number | undefined>(undefined);
  const [hasNext, setHasNext] = useState(true);

  const fetchNotifications = useCallback(
    async (currentCursorId?: number) => {
      if (!hasNext && currentCursorId) return; // 더 이상 데이터가 없으면 요청하지 않음

      setIsLoading(true);
      setError(null);

      try {
        const data = await getNotifications(currentCursorId, size);
        const newAlerts = data.notifications.map(transformNotificationToAlert);

        setAlerts((prev) =>
          currentCursorId ? [...prev, ...newAlerts] : newAlerts
        );
        setCursorId(data.cursorId ?? undefined);
        setHasNext(!!data.cursorId);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : '알림을 불러오지 못했습니다.'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [size, hasNext]
  );

  // 첫 알림 목록 로드
  useEffect(() => {
    fetchNotifications();
  }, []);

  const loadMore = useCallback(() => {
    if (hasNext && !isLoading) {
      fetchNotifications(cursorId);
    }
  }, [hasNext, isLoading, cursorId, fetchNotifications]);

  const handleDeleteNotification = useCallback(
    async (notificationId: number) => {
      try {
        await deleteNotification(notificationId);
        setAlerts((prev) =>
          prev.filter((notif) => notif.id !== notificationId)
        );
      } catch (e) {
        // UI에 에러를 표시하는 로직을 추가할 수 있음
        console.error('알림 삭제 실패:', e);
      }
    },
    []
  );

  return {
    notifications: alerts,
    isLoading,
    error,
    hasNext,
    loadMore,
    handleDeleteNotification,
  };
}
