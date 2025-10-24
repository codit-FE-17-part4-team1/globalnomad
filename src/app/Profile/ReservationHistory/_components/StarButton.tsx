'use client';
import Image from 'next/image';

type rating = {
  isActive: boolean;
  onClick: () => void;
};
export default function StarButton({ isActive, onClick }: rating) {
  return (
    <button onClick={onClick}>
      {isActive ? (
        <Image src="/icon/star_on.svg" width={50} height={50} alt="별점" />
      ) : (
        <Image src="/icon/star_off.svg" width={50} height={50} alt="별점" />
      )}
    </button>
  );
}
