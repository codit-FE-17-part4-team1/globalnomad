'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ParticipantsCounter from '../ActivityReservationInfo/Fragment/ParticipantsCounter';
import MyButton from '@/components/Button/Button';

interface ParticipantsModalProps {
  onClose: () => void;
  onSelectParticipants: (participants: number) => void; // 선택한 인원 수 전달
  initialParticipants: number;
}

const ParticipantsModal: React.FC<ParticipantsModalProps> = ({
  onClose,
  onSelectParticipants,
  initialParticipants,
}) => {
  const [participants, setParticipants] = useState<number>(initialParticipants);

  // 배경 스크롤 막기
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleIncrement = () => setParticipants((prev) => prev + 1);
  const handleDecrement = () =>
    setParticipants((prev) => Math.max(1, prev - 1));

  const handleConfirm = () => {
    onSelectParticipants(participants);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-cente">
      <div className="flex flex-col gap-6 w-full h-full p-5 bg-white box-border">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-black-nomad">인원</h2>
          <button
            className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition"
            onClick={onClose}
          >
            <Image src="/icon/btn/X_lg.svg" alt="닫기" width={30} height={30} />
          </button>
        </div>

        {/* 참여 인원 */}
        <ParticipantsCounter
          participants={participants}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          containerClassName="flex flex-col gap-5"
          label="예약할 인원을 선택해주세요."
          labelClassName="text-xl font-medium text-gray-800"
        />

        {/* 확인 버튼 */}
        <MyButton
          color="buttonPrimary"
          onClick={handleConfirm}
          className="flex items-center justify-center p-4 mt-auto"
        >
          확인
        </MyButton>
      </div>
    </div>
  );
};

export default ParticipantsModal;
