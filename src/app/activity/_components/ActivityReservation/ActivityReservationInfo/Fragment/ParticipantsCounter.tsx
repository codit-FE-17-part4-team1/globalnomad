'use client';

import React from 'react';
import Image from 'next/image';

interface ParticipantsCounterProps {
  participants: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

const ParticipantsCounter: React.FC<ParticipantsCounterProps> = ({
  participants,
  onIncrement,
  onDecrement,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-xl font-bold text-black-nomad">참여 인원 수</div>
      <div className="flex items-center w-30 h-10 border border-gray-400 rounded-[6px] shadow-[0_2px_4px_rgba(5,16,55,0.06),inset_0_0_0_1px_#CDD0DC]">
        <button className="w-10 h-10 p-[10px]" onClick={onDecrement}>
          <Image
            src="/icon/btn/subtract.svg"
            alt="인원 감소"
            width={20}
            height={20}
          />
        </button>
        <span className="text-md font-normal text-gray-800 text-center w-10 h-10 p-[10px]">
          {participants}
        </span>
        <button className="w-10 h-10 p-[10px]" onClick={onIncrement}>
          <Image
            src="/icon/btn/add.svg"
            alt="인원 추가"
            width={20}
            height={20}
          />
        </button>
      </div>
    </div>
  );
};

export default ParticipantsCounter;
