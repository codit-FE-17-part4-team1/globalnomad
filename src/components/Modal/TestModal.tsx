'use client';

import { useState } from 'react';
import ConfirmModal from '@/components/Modal/Presets/ConfirmModal';

export default function TestModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-8">
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => setIsOpen(true)}
      >
        모달 열기
      </button>

      <ConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="테스트 확인 모달"
        message="체험 등록이 완료되었습니다."
        onConfirm={() => alert('확인')}
        confirmLabel="확인"
        size="lg"
        className="bg-[var(--color-green-dark)]"
      ></ConfirmModal>
    </div>
  );
}
