'use client';

import '@/styles/global.css';
import { useRef } from 'react';
// import Portal from '@/components/Modal/Portalmodal';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

// 모달 사이즈를 따로 잡고 싶은데, className으로 직접 작성해야 할 지, 상수로 빼서 관리할 지 고민

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: ModalSize;
  className?: string;
  closeOnOverlay?: boolean;
}

export default function BaseModal({
  isOpen,
  onClose,
  children,
  size = 'md',
  className,
}: BaseModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const handleOverLayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };
  if (!isOpen) {
    return null;
  }

  return (
    // <Portal>
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
      aria-label="모달 오버레이: 클릭하면 닫힘"
      onClick={handleOverLayClick}
    >
      {/* 디테일 잡기? */}
      <div
        role="dialog"
        aria-modal="true"
        // ','를 통해서 배열로 관리 (코드 가독성), join을 통해 문자열로 합치기 --> 이렇게도 된다고 함!
        className={[
          'relative bg-white rounded-lg shadow-xl',
          'max-h-[90vh] overflow-auto w-[540px]', // 스크롤 되도록 설정
          className ?? '',
        ].join(' ')}
      >
        {children}
      </div>
    </div>
    // </Portal>
  );
}
