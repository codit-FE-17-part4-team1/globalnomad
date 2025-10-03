'use client';

import { useState } from 'react';
import BaseModal from '@/components/Modal/BaseModal';

export default function AlertModal() {
  const [openModal, setOpenModal] = useState(false);
  return (
    <BaseModal
      isOpen={openModal}
      onClose={() => setOpenModal(false)}
      title="알림 `${n}`개"
    >
      <div className="bg-white"></div>
    </BaseModal>
  );
}
