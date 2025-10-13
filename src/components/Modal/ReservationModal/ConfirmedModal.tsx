'use client';

import ReservationModalBase from './ReservationModalBase';
import Chips from '@/components/chips/Chips';
import type { ReservationStatus } from '@/types/calendar';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  time: string;
  reservations: {
    nickname: string;
    people: number;
    status: ReservationStatus;
  }[];
  status: ReservationStatus;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  date,
  time,
  reservations,
  status,
}: ConfirmModalProps) {
  return (
    <ReservationModalBase
      isOpen={isOpen}
      onClose={onClose}
      status={status}
      date={date}
      time={time}
      reservations={reservations}
      renderActionButtons={() => (
        <Chips color="orange" variant="round">
          예약 승인
        </Chips>
      )}
    />
    // chips가 어떻게 들어가야 하는건가? -> prop으로 내려줬는데 확인 필요할 듯 -> 확인 완료!
  );
}
