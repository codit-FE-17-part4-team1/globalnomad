'use client';

import { useRef } from 'react';

// 모달 사이즈를 따로 잡고 싶은데, className으로 직접 작성해야 할 지, 상수로 빼서 관리할 지 고민 -> 공통에서는 빼버림! 각자 진행하도록!

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  closeOnOverlay?: boolean; // 추가
  closeOnEsc?: boolean; // 추가
}

export default function BaseModal({
  isOpen,
  onClose,
  children,
  className,
  title,
  closeOnOverlay = true, // 기본값
  closeOnEsc = true, // 얘도 추가해보고 싶은데 어떻게 쓸 수 있을까?(고민, 공부필요)
}: BaseModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const handleOverLayClick = (e: React.MouseEvent) => {
    if (!closeOnOverlay) return;
    if (e.target === overlayRef.current) onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] grid place-items-center bg-black/50 p-4"
      aria-label="모달 오버레이"
      onClick={handleOverLayClick}
    >
      {/* 디테일 잡기? */}
      <div
        role="dialog"
        aria-modal="true"
        // ','를 통해서 배열로 관리 (코드 가독성), join을 통해 문자열로 합치기 --> 이렇게도 된다고 함!
        className={[
          'relative  rounded-lg shadow-xl',
          'max-h-[90vh] overflow-auto w-[540px]', // 스크롤 되도록 설정
          className ?? '',
        ].join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
