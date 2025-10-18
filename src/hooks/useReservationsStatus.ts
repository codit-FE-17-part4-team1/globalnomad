// 3. 전달한 체험명을 클릭했을 때 해당 체험명에 해당하는 예약 정보(신청,승인,거절)가 전달되어야 함 (각 모달에 내려주기?)
// 3-1. 예약 정보에 날짜, 시간의 데이터도 전달되어야 함
// 3-2. 신청: 승인하기/거절하기 클릭 시 업데이트가 되어야 함

import { useState } from 'react';
import { updateReservationStatus } from '@/lib/myactivities/api';

/**
 * 예약 상태 변경(승인/거절) 로직을 관리하는 커스텀 훅
 */
export default function useReservationsStatus(
  accessToken?: string,
  activityId?: number
) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  /**
   * 예약 상태를 '승인' 또는 '거절'로 업데이트합니다.
   * @param reservationId - 상태를 변경할 예약의 ID
   * @param status - 변경할 상태 ('confirmed' 또는 'declined')
   * @param onSuccess - 상태 변경 성공 시 호출될 콜백 함수
   */
  const handleUpdateStatus = async (
    reservationId: number,
    status: 'confirmed' | 'declined',
    onSuccess?: () => void
  ) => {
    if (!accessToken || !activityId) {
      setUpdateError('인증 정보 또는 체험 ID가 없습니다.');
      return;
    }

    try {
      setIsUpdating(true);
      setUpdateError(null);
      await updateReservationStatus({
        accessToken,
        activityId,
        reservationId,
        status,
      });
      onSuccess?.(); // 성공 콜백 실행 (데이터 재조회 등)
    } catch (e) {
      setUpdateError(
        e instanceof Error ? e.message : '상태 업데이트에 실패했습니다.'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return { handleUpdateStatus, isUpdating, updateError };
}
