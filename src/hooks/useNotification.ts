// 해당 훅은 GET, DELETE를 통해 데이터를 가져온 후에 삭제하기
// api 함수를 가져와서 UI 에 전달해줘야 하는 건데,

import { useState, useCallback, useEffect } from 'react';
import {
  getNotifications,
  deleteNotification,
} from '@/lib/mynotifications/api';
import type { Notification } from '@/types/api/mynotifications';
import type { Alert } from '@/components/Modal/AlertModal';
import { access } from 'fs';

/**
 * API 응답(Notification)을 UI 모델(Alert)로 변환
 * "코인 노래방(2025-10-24 12:00~13:00) 예약이 거절되었습니다." 형식의 문자열을 파싱
 * @param notification API에서 받은 알림 객체
 */
function transformNotificationToAlert(notification: Notification): Alert {
  const { id, content, createdAt } = notification;

  console.log('원본 content:', content);

  // 알림 받는 데이터 정보 파싱
  const titleMatch = content.match(/^(.*?)\(/);
  const timeMatch = content.match(/\((.*?)\)/);
  const statusMatch = content.match(/예약이 (승인|거절)되었습니다/);

  const title = titleMatch ? titleMatch[1].trim() : '내용 없음';
  const time = timeMatch ? timeMatch[1] : '시간 정보 없음';
  const status = statusMatch ? (statusMatch[1] as '승인' | '거절') : '승인';

  console.log('파싱 결과:', { title, time, status });

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
export default function useNotification(
  accessToken?: string,
  size: number = 10
) {
  console.log('🔑 useNotification - accessToken:', accessToken);
  console.log('🔑 accessToken 타입:', typeof accessToken);
  console.log('🔑 accessToken 존재 여부:', !!accessToken);

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cursorId, setCursorId] = useState<number | undefined>(undefined);
  const [hasNext, setHasNext] = useState(true);

  const fetchNotifications = useCallback(
    async (currentCursorId?: number) => {
      console.log('🔑 fetchNotifications - accessToken:', accessToken);

      if (!hasNext && currentCursorId) return; // 더 이상 데이터가 없으면 요청하지 않음

      console.log('🔍 fetchNotifications 시작', { currentCursorId, size }); // 추가

      setIsLoading(true);
      setError(null);

      try {
        console.log('📡 API 호출 시작...'); // 추가
        const data = await getNotifications(currentCursorId, size, accessToken);
        console.log('✅ API 응답 받음:', data); // 추가
        console.log('📋 notifications 배열:', data.notifications); // 추가
        console.log('📋 notifications 길이:', data.notifications?.length); // 추가

        const newAlerts = data.notifications.map(transformNotificationToAlert);
        console.log('변환된 alerts:', newAlerts); // 추가

        setAlerts((prev) => {
          const result = currentCursorId ? [...prev, ...newAlerts] : newAlerts;
          console.log('💾 setAlerts 호출:', result); // 추가
          return result;
        });

        setCursorId(data.cursorId ?? undefined);
        setHasNext(!!data.cursorId);
      } catch (e) {
        console.error('❌ API 호출 실패:', e); // 추가
        setError(
          e instanceof Error ? e.message : '알림을 불러오지 못했습니다.'
        );
      } finally {
        setIsLoading(false);
        console.log('✅ fetchNotifications 완료'); // 추가
      }
    },
    [size, hasNext, accessToken]
  );

  // 첫 알림 목록 로드
  useEffect(() => {
    console.log('🚀 useEffect 실행 - 첫 로드'); // 추가
    fetchNotifications();
  }, []);

  useEffect(() => {
    console.log('📊 alerts 상태 변경됨:', alerts); // 추가
  }, [alerts]);

  const loadMore = useCallback(() => {
    if (hasNext && !isLoading) {
      fetchNotifications(cursorId);
    }
  }, [hasNext, isLoading, cursorId, fetchNotifications]);

  const handleDeleteNotification = useCallback(
    async (notificationId: number) => {
      try {
        await deleteNotification(notificationId, accessToken);
        setAlerts((prev) =>
          prev.filter((notif) => notif.id !== notificationId)
        );
      } catch (e) {
        console.error('알림 삭제 실패:', e);
      }
    },
    [accessToken]
  );

  console.log('🔄 useNotification 렌더링:', {
    alertsLength: alerts.length,
    isLoading,
    error,
    hasNext,
  }); // 추가

  return {
    notifications: alerts,
    isLoading,
    error,
    hasNext,
    loadMore,
    handleDeleteNotification,
  };
}
