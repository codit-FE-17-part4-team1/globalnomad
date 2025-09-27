import '@/styles/global.css';
import { useEffect, useRef } from 'react';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

const sizeMap: Record<ModalSize, string> = {
  sm: 'w-[24rem] max-w-[90vw]',
  md: 'w-[32rem] max-w-[90vw]',
  lg: 'w-[40rem] max-w-[95vw]',
  xl: 'w-[56rem] max-w-[95vw]',
  full: 'w-screen h-screen rounded-none',
};

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
  size = 'lg',
  className,
  closeOnOverlay,
}: BaseModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  // const handleOverLayClick = (e: React.MouseEvent) => {
  //   if (e.target === overlayRef.current) {
  //     onClose();
  //   }
  // };
  // if (!isOpen) {
  //   return null;
  // }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
      aria-label="모달 오버레이: 클릭하면 닫힘"
      onClick={(e) => {
        if (closeOnOverlay && e.target === overlayRef.current) onClose();
      }}
    >
      {/* 여기서 하얀 박스/테두리/그림자/폭을 준다 */}
      <div
        role="dialog"
        aria-modal="true"
        className={[
          'relative bg-white rounded-2xl shadow-xl',
          'max-h-[90vh] overflow-auto', // 내용 많을 때 스크롤
          sizeMap[size],
          className ?? '',
        ].join(' ')}
      >
        {children}
      </div>
    </div>
  );
}
