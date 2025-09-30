'use client';

import '@/styles/global.css';
import BaseModal from '@/components/Modal/BaseModal';
import Button from '@/playground/deprecated/Button/Button';

type ModalSize = 'md' | 'lg' | 'xl';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  onConfirm?: () => void; // 없으면 ‘확인’이 그냥 onClose
  confirmLabel?: string; // 확인
  size?: ModalSize;
  className?: string;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  message,
  onConfirm,
  confirmLabel = '확인',
  size = 'lg',
  className,
}: ConfirmModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      className={className}
    >
      <div className="p-8">
        <p className="pt-14 text-center text-black">{message}</p>
        <div className="mt-8 flex justify-end gap-2">
          {/* 버튼 공통 컴포넌트 추가 위치, 현재 임시로 진행함  */}
          <Button label="확인" variant="primary" onClick={onConfirm ?? onClose}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
