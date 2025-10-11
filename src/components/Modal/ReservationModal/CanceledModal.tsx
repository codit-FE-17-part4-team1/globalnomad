'use client';

import ReservationModalBase from './ReservationModalBase';
import Chips from '@/components/chips/Chips';
import type { CalStatus } from '@/types/calendar';

interface CanceledModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  time: string;
  reservations: { nickname: string; people: number; status: CalStatus }[];
  status: CalStatus;
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
      renderActionButtons={() => (
        <Chips color="red" variant="round">
          예약 거절
        </Chips>
      )}
    />
  );
}
