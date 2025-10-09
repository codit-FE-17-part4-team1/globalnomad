'use client';

import ReservationModalBase from './ReservationModalBase';
import Button from '@/components/Button/Button';

interface PendingModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  time: string;
  reservations: { nickname: string; people: number }[];
  onApprove: (nickname: string) => void;
  onReject: (nickname: string) => void;
}

export default function PendingModal({
  isOpen,
  onClose,
  date,
  time,
  reservations,
  onApprove,
  onReject,
}: PendingModalProps) {
  return (
    <ReservationModalBase
      isOpen={isOpen}
      onClose={onClose}
      status="pending"
      date={date}
      time={time}
      reservations={reservations}
      renderActionButtons={(item) => (
        <div className="flex space-x-2">
          <Button
            className="bg-[var(--color-green-dark)] text-white"
            onClick={() => onApprove(item.nickname)}
          >
            승인하기
          </Button>
          <Button onClick={() => onReject(item.nickname)}>거절하기</Button>
        </div>
      )}
    />
  );
}
