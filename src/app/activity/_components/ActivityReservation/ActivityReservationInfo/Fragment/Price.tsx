'use client';

import React from 'react';

interface PriceProps {
  price: number;
  className?: string; // Price 전체 div 스타일용
  perPersonClassName?: string; // span (/인) 스타일용
}

const Price: React.FC<PriceProps> = ({
  price,
  className = '',
  perPersonClassName = '',
}) => {
  return (
    <div
      className={`text-xl md:text-2xl lg:text-3xl font-bold text-black ${className}`}
    >
      ₩ {price.toLocaleString()}{' '}
      <span
        className={`text-2lg md:text-lg lg:text-xl font-normal text-gray-800 ${perPersonClassName}`}
      >
        / 인
      </span>
    </div>
  );
};

export default Price;
