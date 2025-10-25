'use client';

import { useRef, useEffect } from 'react';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
}

export default function BaseModal({
  isOpen,
  onClose,
  children,
  className,
  title,
  closeOnOverlay = true,
  closeOnEsc = true,
}: BaseModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeOnEsc, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlay && e.target === overlayRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] grid place-items-center bg-black/50 p-4"
      aria-label="모달 오버레이"
      onClick={handleOverlayClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={[
          'relative rounded-lg shadow-xl',
          'max-h-[90vh] overflow-auto w-[540px]',
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
