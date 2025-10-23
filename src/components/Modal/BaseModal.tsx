'use client';

import { useRef, useEffect } from 'react';

// 모달 사이즈를 따로 잡고 싶은데, className으로 직접 작성해야 할 지, 상수로 빼서 관리할 지 고민 -> 공통에서는 빼버림! 각자 진행하도록!

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  variant?: 'center' | 'dropdown';
}

export default function BaseModal({
  isOpen,
  onClose,
  children,
  className,
  title,
  closeOnOverlay = true, // 기본값
  closeOnEsc = true, // 얘도 추가해보고 싶은데 어떻게 쓸 수 있을까?(고민, 공부필요)
  variant = 'center', // 기본값
}: BaseModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // dropdown의 바깥 클릭 처리  --> 적용 안됨 일단 보류 ..
  useEffect(() => {
    if (!isOpen || variant !== 'dropdown' || !closeOnOverlay) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (!modalRef.current) return;

      if (!modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, variant, closeOnOverlay, onClose]);

  const handleOverLayClick = (e: React.MouseEvent) => {
    if (!closeOnOverlay) return;
    if (e.target === overlayRef.current) onClose();
  };

  if (!isOpen) {
    return null;
  }

  // relative, absolute로 위치 조정할 수 있지 않을까... (헤더가 relative가 되는거지)
  if (variant === 'dropdown') {
    return (
      <div
        role="dialog"
        aria-modal="true"
        className={[
          'absolute top-15 bg-[var(--color-green-light)]',
          'rounded-lg shadow-xl',
          'max-h-[400px] overflow-auto z-[9999] w-[330px]',
        ].join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-xl font-semibold">{title}</h2>
          </div>
        )}
        {children}
      </div>
    );
  }

  // 이건 기본 ! (center일 경우라서 공통컴포넌트로 그대로 사용 가능)
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
          'max-h-[90vh] overflow-auto w-[540px]', // 스크롤 되도록 설정 (근데 전에도 궁금했는데, 왜 overflow가 아닌 무한스크롤을 따로 구현해야 하는지? 몇 개를 가져올 지 정해야 해서?)
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
