'use client';

import React from 'react';
import Image from 'next/image';

interface ParticipantsCounterProps {
  participants: number;
  onIncrement: () => void;
  onDecrement: () => void;
  containerClassName?: string; // 타이틀 + 카운터 컨테이너 박스
  label?: string; // 부모에서 텍스트를 넣도록
  labelClassName?: string; // 부모에서 타이틀 텍스트 스타일 조절 가능
  counterContainerClassName?: string; // 버튼+숫자 박스 스타일
  buttonClassName?: string; // 버튼 스타일
  countTextClassName?: string; // 인원 수(숫자) 스타일
}

const ParticipantsCounter: React.FC<ParticipantsCounterProps> = ({
  participants,
  onIncrement,
  onDecrement,
  containerClassName = 'flex flex-col gap-3',
  label,
  labelClassName = 'text-xl font-bold text-black-nomad',
  counterContainerClassName = 'flex items-center w-30 h-10 border border-gray-400 rounded-[6px] shadow-[0_2px_4px_rgba(5,16,55,0.06),inset_0_0_0_1px_#CDD0DC]',
  buttonClassName = 'w-10 h-10 p-[10px]',
  countTextClassName = 'text-md font-normal text-gray-800 text-center w-10 h-10 p-[10px]',
}) => {
  return (
    <div className={containerClassName}>
      {label && <div className={labelClassName}>{label}</div>}
      <div className={counterContainerClassName}>
        <button className={buttonClassName} onClick={onDecrement}>
          <Image
            src="/icon/btn/subtract.svg"
            alt="인원 감소"
            width={20}
            height={20}
          />
        </button>
        <span className={countTextClassName}>{participants}</span>
        <button className={buttonClassName} onClick={onIncrement}>
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
