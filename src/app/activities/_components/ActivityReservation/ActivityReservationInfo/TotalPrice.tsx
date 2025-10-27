'use client';

import React from 'react';

interface TotalPriceProps {
  price: number;
  participants: number;
}

const TotalPrice: React.FC<TotalPriceProps> = ({ price, participants }) => {
  return (
    <div className="flex justify-between text-xl font-bold text-black-nomad">
      <span>총 합계</span>
      <span>₩ {(price * participants).toLocaleString()}</span>
    </div>
  );
};

export default TotalPrice;
