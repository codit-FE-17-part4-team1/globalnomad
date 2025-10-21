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
   * 예약 상태를 '승인' 또는 '거절'로 업데이트
   */
  const handleUpdateStatus = async (
    reservationId: number,
    status: 'confirmed' | 'declined',
    onSuccess?: () => void
  ) => {
    if (!accessToken || !activityId) {
      setUpdateError('체험 정보가 없습니다.');
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
      onSuccess?.();
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
