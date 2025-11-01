'use client';
import { useState } from 'react';
import Image from 'next/image';
import Modal from '@/components/Modal/BaseModal';
import StarButton from '@/app/Profile/ReservationHistory/_components/StarButton';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import CustomInput from '@/components/Input/CustomInput';

type ReservationInfo = {
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
};
type ModalType = {
  isRawOpen: boolean;
  setRawOpen: React.Dispatch<React.SetStateAction<boolean>>;
  reservationId?: number;
  reservationInfo: ReservationInfo;
};
export default function ReviewModal({
  isRawOpen,
  setRawOpen,
  reservationId,
  reservationInfo,
}: ModalType) {
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [modal, setModal] = useState({
    isOpen: false,
    message: '',
  });
  // 모달 열기
  const showModal = (message: string) => {
    setModal({ isOpen: true, message });
  };

  // 모달 닫기
  const closeModal = () => {
    setModal({ isOpen: false, message: '' });
  };

  const handleSubmit = async () => {
    if (!reservationId) return;
    if (rating === 0) {
      showModal('별점을 선택해주세요.');
      return;
    }
    if (!content.trim()) {
      showModal('후기 내용을 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `/api/my-reservations/${reservationId}/reviews`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            rating,
            content,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '후기 작성에 실패했습니다.');
      }
      showModal('후기 작성 완료!');
      setRawOpen(false);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : '후기 작성에 실패했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isRawOpen}
        onClose={() => setRawOpen(false)}
        className="bg-white md:!w-[480px] !w-[375px] overflow-y-auto scrollbar-hide"
      >
        <div className="md:p-6 p-4 relative">
          <div className="sticky top-6 flex justify-between items-center md:mb-10 mb-8">
            <h2 className="text-xl font-semibold">후기 작성</h2>
            <button onClick={() => setRawOpen(false)}>
              <Image
                src="/icon/btn/X_lg.svg"
                width={40}
                height={40}
                alt="모달 닫기"
              />
            </button>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex">
              <Image
                src={reservationInfo.activity.bannerImageUrl}
                width={126}
                height={126}
                alt="체험 사진"
                className="rounded-xl md:size-[126px] size-[100px] flex-shrink-0 object-cover"
              />
              <div className="flex flex-col md:gap-3 gap-1.5 flex-auto pl-6 min-w-0">
                <h3 className="md:text-[20px] text-lg font-bold text-ellipsis whitespace-nowrap overflow-hidden">
                  {reservationInfo.activity.title}
                </h3>
                <p className="md:text-2lg text-md">
                  <span>{reservationInfo.date}</span>·
                  <span>{reservationInfo.startTime}</span>~
                  <span>{reservationInfo.endTime}</span>·
                  <span>{reservationInfo.headCount}명</span>
                </p>
                <hr className=" opacity-20" />
                <p className="md:text-3xl text-[20px] font-bold">
                  ₩{reservationInfo.totalPrice}
                </p>
              </div>
            </div>
            <div className="flex gap-2 justify-center items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarButton
                  key={star}
                  isActive={star <= rating}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
            <CustomInput
              id="description"
              name="description"
              variant="textarea"
              labelText=""
              placeholder="후기를 작성해주세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="w-full h-12 rounded bg-[var(--color-orange-dark)] text-white"
            >
              작성하기
            </button>
          </div>
        </div>
      </Modal>
      {/* 확인모달 */}
      <ConfirmModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        message={modal.message}
        className="bg-white"
        onConfirm={closeModal}
      />
    </>
  );
}
