'use client';

import ReservationModalBase from './ReservationModalBase';
import type { ReservationStatus } from '@/types/calendar';

interface PendingModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  time: string;
  reservations: {
    nickname: string;
    people: number;
    status: ReservationStatus;
    time: string;
    id: number;
  }[];
  onApprove: (reservationId: number) => void;
  onReject: (reservationId: number) => void;
  status: ReservationStatus;
  position?: { top: number; left: number };
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
  position,
}: PendingModalProps) {
  return (
    <ReservationModalBase
      isOpen={isOpen}
      onClose={onClose}
      status={status}
      date={date}
      time={time}
      reservations={reservations}
      onApprove={onApprove}
      onReject={onReject}
      position={position}
    />
  );
}
