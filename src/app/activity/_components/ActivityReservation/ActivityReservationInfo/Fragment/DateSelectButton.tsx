'use client';

import React from 'react';

interface DateSelectButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

const DateSelectButton: React.FC<DateSelectButtonProps> = ({
  onClick,
  label = '날짜 선택하기',
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      className={`text-black-nomad font-semibold text-lg hover:underline focus:outline-none ${className}`}
    >
      {label}
    </button>
  );
};

export default DateSelectButton;
