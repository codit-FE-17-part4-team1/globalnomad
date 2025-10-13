'use client';

import ReservationModalBase from './ReservationModalBase';
import Button from '@/components/Button/Button';
import type { CalEvent, ReservationStatus } from '@/types/calendar';

interface PendingModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  time: string;
  reservations: (CalEvent & { people: number })[];
  onApprove: (nickname: string) => void;
  onReject: (nickname: string) => void;
  status: ReservationStatus;
}

export default function PendingModal({
  isOpen,
  onClose,
  date,
  time,
  reservations,
  onApprove,
  onReject,
  status,
}: PendingModalProps) {
  return (
    <ReservationModalBase
      isOpen={isOpen}
      onClose={onClose}
      status={status}
      date={date}
      time={time}
      reservations={reservations.map((item) => ({
        nickname: item.nickname || '',
        people: item.people,
        status: item.status,
      }))}
      renderActionButtons={(item) => (
        <div className="flex space-x-2">
          {/* 버튼 스타일이 왜 안 먹을까? */}
          <Button
            className="bg-[var(--color-green-dark)] p-2 text-white text-sm"
            onClick={() => onApprove(item.nickname)}
          >
            승인하기
          </Button>
          <Button
            className="p-2 text-black border-[var(--color-gray-400)] text-sm "
            onClick={() => onReject(item.nickname)}
          >
            거절하기
          </Button>
        </div>
      )}
    />
  );
}
