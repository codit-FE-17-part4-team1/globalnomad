'use client';
import Image from 'next/image';
import BaseModal from '@/components/Modal/BaseModal';
import Button from '@/components/Button/Button';

type ModalType = {
  isRawOpen: boolean;
  setRawOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CancelModal({ isRawOpen, setRawOpen }: ModalType) {
  return (
    <BaseModal isOpen={isRawOpen} onClose={() => setRawOpen(false)} size="md">
      <div className="p-6">
        <div className="flex flex-col justify-center items-center gap-4">
          <Image
            src="/icon/confirm_check.svg"
            width={24}
            height={24}
            alt="체크"
          />
          <p>예약을 취소하시겠어요?</p>
        </div>
        <div className="flex justify-center gap-2 mt-6">
          <Button
            color="buttonSecondary"
            onClick={() => setRawOpen(false)}
            className="w-20 h-[38px] text-md"
          >
            아니요
          </Button>
          <Button
            color="buttonPrimary"
            onClick={() => {}}
            className="w-20 h-[38px] text-md"
          >
            취소하기
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
