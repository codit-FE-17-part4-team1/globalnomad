'use client';

import BaseModal from '@/components/Modal/BaseModal';
import type { CalEvent } from '@/types/calendar';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  event: CalEvent;
  onApprove?: (e: CalEvent) => void;
  onReject?: (e: CalEvent) => void;
};

export default function PendingModal({
  isOpen,
  onClose,
  event,
  onApprove,
  onReject,
}: Props) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} size="md" title="예약 정보">
      <div className="border-b"></div>
    </BaseModal>
  );
}
