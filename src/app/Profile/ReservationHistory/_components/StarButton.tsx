'use client';
import Image from 'next/image';
import { useState } from 'react';
export default function StarButton() {
  const [isStar, SetIsStar] = useState(false);
  return (
    <button
      onClick={() => {
        SetIsStar(!isStar);
      }}
    >
      {isStar ? (
        <Image src="/icon/star_on.svg" width={50} height={50} alt="별점" />
      ) : (
        <Image src="/icon/star_off.svg" width={50} height={50} alt="별점" />
      )}
    </button>
  );
}
