import '@/styles/global.css';
import BaseModal from '@/components/Modal/BaseModal';
import Button from '@/playground/deprecated/Button/Button';

type ModalSize = 'md' | 'lg' | 'xl';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  onConfirm?: () => void; // 없으면 ‘확인’이 그냥 onClose
  confirmLabel?: string; // 확인
  size?: ModalSize;
  className?: string;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  title,
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
        {title && <h2 className="mb-4 text-xl font-semibold">{title}</h2>}
        <p className="text-center text-gray-700">{message}</p>
        <div className="mt-8 flex justify-end gap-2">
          <Button label="확인" variant="primary" onClick={onConfirm ?? onClose}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
