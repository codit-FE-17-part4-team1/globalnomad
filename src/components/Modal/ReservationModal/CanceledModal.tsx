'use client';

import ReservationModalBase from './ReservationModalBase';
import type { ReservationStatus } from '@/types/calendar';

interface CanceledModalProps {
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
  status: ReservationStatus;
}

export default function CanceledModal({
  isOpen,
  onClose,
  date,
  time,
  reservations,
  status,
}: CanceledModalProps) {
  return (
    <ReservationModalBase
      isOpen={isOpen}
      onClose={onClose}
      status={status}
      date={date}
      time={time}
      reservations={reservations}
    />
  );
}
