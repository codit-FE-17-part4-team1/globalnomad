'use client';

import Image from 'next/image';
import '@/styles/global.css';
import BaseModal from '@/components/Modal/BaseModal';
import MyButton from '@/components/Button/Button'; // 공통 컴포넌트로 변경 필요 (완료)

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  onConfirm?: () => void; // 없으면 ‘확인’이 그냥 onClose
  confirmLabel?: string; // 확인
  className?: string;
  size?: 'md' | 'lg' | 'xl';
  type?: 'success' | 'error' | 'info'; // 타입 추가
}

export default function ConfirmModal({
  isOpen,
  onClose,
  message,
  onConfirm,
  confirmLabel = '확인',
  className,
  type = 'info', // 기본값
}: ConfirmModalProps) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '/images/design_2/success.png'; // 성공 이미지 경로
      case 'error':
        return '/images/design_2/warning.png'; // 실패 이미지 경로
      case 'info':
      default:
        return '/images/design_2/earth.png'; // 기본 이미지 경로
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} className={className}>
      <div className="p-8  mt-10">
        <div className="flex items-center justify-center mb-4">
          <Image
            src={getIcon()}
            alt={`${type} icon`}
            width={50}
            height={50}
            className="object-contain"
          />
        </div>
        <p className="text-center text-black">{message}</p>
        <div className="mt-8 flex justify-end gap-2">
          <MyButton
            color="buttonPrimary"
            onClick={onConfirm ?? onClose}
            className="px-10 py-2 rounded bg-[var(--color-orange-dark)] text-white disabled:opacity-50 border-none hover:bg-[var(--color-orange-light)]"
          >
            {confirmLabel}
          </MyButton>
        </div>
      </div>
    </BaseModal>
  );
}
