import '@/styles/global.css';
import BaseModal from '@/components/Modal/BaseModal';
import Button from '@/components/ui/Button/Button';

interface ButtonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  ariaLabel?: string;
  children: React.ReactNode;
  width?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
  submitText?: string;
  cancleText?: string;
  isSubmitDisabled?: boolean;
  hideCancelButton?: boolean;
  errorMessage?: string;
}

export default function ButtonModal({
  isOpen,
  onClose,
  title, // '후기작성'의 타이틀이 될 것 같음
  ariaLabel, // 타이틀이 없는 모달이 있음
  children,
  width,
  onSubmit,
  onCancel,
  submitText = '취소하기',
  cancleText = '아니오',
  isSubmitDisabled,
  hideCancelButton,
  errorMessage,
}: ButtonModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit?.();
    }
  };

  const hasTitle = Boolean(title);

  return (
    <BaseModal isOpen={isOpen} width={width} onClose={onClose}>
      <div>
        {hasTitle && <h2 id="modal-title">{title}</h2>}

        <form onSubmit={handleSubmit}>
          <div className={hasTitle ? 'space-y-6' : 'space-y-6 mt-2'}>
            {children}

            {errorMessage && (
              <div className="-mt-2 text-sm text-red-500">{errorMessage}</div>
            )}

            <div>
              {!hideCancelButton && (
                <Button
                  label={cancleText}
                  onClick={onCancel ?? onClose}
                  backgroundColor="green"
                />
              )}
            </div>
          </div>
        </form>
      </div>
    </BaseModal>
  );
}
