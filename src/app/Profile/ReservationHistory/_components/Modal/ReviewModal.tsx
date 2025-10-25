'use client';
import { useState } from 'react';
import Image from 'next/image';
import Modal from '@/components/Modal/BaseModal';
import StarButton from '@/app/Profile/ReservationHistory/_components/StarButton';
import CustomInput from '@/components/Input/CustomInput';
import { postReviews } from '@/actions/myreservations.action';

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
  const handleSubmit = async () => {
    if (!reservationId) return;
    if (!content.trim()) {
      alert('후기 내용을 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      await postReviews(reservationId, {
        rating,
        content,
      });
      alert('후기 작성 완료');
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
    <Modal
      isOpen={isRawOpen}
      onClose={() => setRawOpen(false)}
      className="bg-white"
    >
      <div className="p-6 relative">
        <div className="sticky top-6 flex justify-between items-center mb-10">
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
              className="rounded-xl"
            />
            <div className="flex flex-col gap-3 flex-auto pl-6 ">
              <h3 className="text-[20px] font-bold">
                {reservationInfo.activity.title}
              </h3>
              <p className="text-2lg">
                <span>{reservationInfo.date}</span>·
                <span>{reservationInfo.startTime}</span>~
                <span>{reservationInfo.endTime}</span>·
                <span>{reservationInfo.headCount}명</span>
              </p>
              <hr className=" opacity-20" />
              <p className="text-3xl font-bold">{reservationInfo.totalPrice}</p>
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
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            className="w-full h-12 rounded bg-[var(--color-green-dark)] text-white"
          >
            작성하기
          </button>
        </div>
      </div>
    </Modal>
  );
}
