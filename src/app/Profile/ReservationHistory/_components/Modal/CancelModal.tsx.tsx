'use client';
import Image from 'next/image';
import BaseModal from '@/components/Modal/BaseModal';
import Button from '@/components/Button/Button';
import { pacthMyReservations } from '@/actions/myreservations.action';

type ReservationData = {
  totalCount: number;
  reservations: Array<{
    id: number;
    status: string;
    date: string;
    startTime: string;
    endTime: string;
    headCount: number;
    totalPrice: number;
    activity: {
      title: string;
      bannerImageUrl: string;
    };
  }>;
  cursorId: null | string;
};
type ModalType = {
  isRawOpen: boolean;
  setRawOpen: React.Dispatch<React.SetStateAction<boolean>>;
  reservationId?: number;
  setData: React.Dispatch<React.SetStateAction<ReservationData | null>>;
};

export default function CancelModal({
  isRawOpen,
  setRawOpen,
  reservationId,
  setData,
}: ModalType) {
  console.log(reservationId);
  const handleCancel = async () => {
    if (!reservationId) return;
    try {
      await pacthMyReservations(reservationId);
      setData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          reservations: prev.reservations.filter((r) => r.id !== reservationId),
        };
      });
      alert('예약이 취소되었습니다.');
      setRawOpen(false);
    } catch (error) {
      console.error(error);
      alert('취소 중 오류가 발생했습니다.');
    }
  };
  return (
    <BaseModal
      isOpen={isRawOpen}
      onClose={() => setRawOpen(false)}
      className="bg-white w-[184px]"
    >
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
            className="w-20 h-[38px] text-md"
            onClick={handleCancel}
          >
            취소하기
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
