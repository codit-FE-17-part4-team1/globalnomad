'use client';

import ReservationModalBase from './ReservationModalBase';
import Chips from '@/components/chips/Chips';

interface CanceledModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  time: string;
  reservations: { nickname: string; people: number }[];
}

export default function CanceledModal({
  isOpen,
  onClose,
  date,
  time,
  reservations,
}: CanceledModalProps) {
  return (
    <ReservationModalBase
      isOpen={isOpen}
      onClose={onClose}
      status="canceled"
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
