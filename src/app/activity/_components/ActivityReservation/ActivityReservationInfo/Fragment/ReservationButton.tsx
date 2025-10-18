'use client';

import React from 'react';
import MyButton from '@/components/Button/Button';

interface ReservationButtonProps {
  disabled: boolean;
  onReserve: () => void;
  label?: string; // 버튼 텍스트를 옵션으로 전달
  className?: string;
}

const ReservationButton: React.FC<ReservationButtonProps> = ({
  disabled,
  onReserve,
  label = '예약하기', // 기본값 설정
  className = '',
}) => {
  return (
    <MyButton
      color="buttonPrimary"
      className={`flex items-center justify-center p-4 ${className}`}
      disabled={disabled}
      onClick={onReserve}
    >
      {label}
    </MyButton>
  );
};

export default ReservationButton;
