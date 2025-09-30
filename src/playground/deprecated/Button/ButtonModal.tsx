import '@/styles/global.css';
import BaseModal from '@/components/Modal/BaseModal';
import Button from '@/playground/deprecated/Button/Button';

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
  title, // '후기작성' 타이틀을 가져올 수 있을 듯
  ariaLabel, // 모달 내용 구분 용도
  children, // contents ?
  width,
  onSubmit,
  onCancel,
  // 이 항목을 넣어야 할 지 고민 ,, Text가 두개로 나뉘는 모달은 1개 뿐이라 (예약/예약취소)
  // 유지한다면, 버튼 UI 스타일은 한개인데 두개로 어떻게 세팅하지?  flex로 정렬할까?
  submitText,
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
        {/* 타이틀이 있을 경우, 타이틀이 보여지도록 */}
        {hasTitle && <h2 id="modal-title">{title}</h2>}
        {/* 본문 contents 내용 */}
        <form onSubmit={handleSubmit}>
          <div className={hasTitle ? 'space-y-6' : 'space-y-6 mt-2'}>
            {children}

            {errorMessage && (
              <div className="-mt-2 text-psm text-red-500">{errorMessage}</div>
            )}
            {/* 취소하기 버튼 - flase로 두면 취소하기 버튼을 확인할 수 있음 */}
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
