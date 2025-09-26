import '@/styles/global.css';
import { useRef } from 'react';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
}

export default function BaseModal({
  isOpen,
  onClose,
  children,
  width = 'w-[40rem]',
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
    <div
      role="button"
      aria-label="모달 오버레이: 클릭하면 모달이 종료됩니다."
      tabIndex={0}
      className="flex-center fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)]"
      ref={overlayRef}
      onClick={handleOverLayClick}
    >
      <div role="dialog" aria-modal="true">
        {children}
      </div>
    </div>
  );
}
