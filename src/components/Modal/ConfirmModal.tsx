'use client';

import '@/styles/global.css';
import BaseModal from '@/components/Modal/BaseModal';
import MyButton from '@/components/Button/Button'; // 공통 컴포넌트로 변경 필요

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  onConfirm?: () => void; // 없으면 ‘확인’이 그냥 onClose
  confirmLabel?: string; // 확인
  className?: string;
  size?: 'md' | 'lg' | 'xl';
}

export default function ConfirmModal({
  isOpen,
  onClose,
  message,
  onConfirm,
  confirmLabel = '확인',
  className,
}: ConfirmModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} className={className}>
      <div className="p-8">
        <p className="pt-14 text-center text-black">{message}</p>
        <div className="mt-8 flex justify-end gap-2">
          {/* 버튼 공통 컴포넌트 추가 위치, 현재 임시로 진행함  */}
          <MyButton
            color="buttonPrimary"
            onClick={onConfirm ?? onClose}
            className="px-10 py-2 rounded bg-[var(--color-green-dark)] text-white disabled:opacity-50 border-none hover:bg-[var(--color-green-light)]"
          >
            {confirmLabel}
          </MyButton>
        </div>
      </div>
    </BaseModal>
  );
}
