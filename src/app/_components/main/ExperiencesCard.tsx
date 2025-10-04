'use client';

import React from 'react';
import Image from 'next/image';

export interface ExperiencesCardProps {
  id: number;
  image: string;
  title: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  type?: 'sm' | 'lg';
}

// 카드 래퍼 크기
const cardSize = {
  lg: 'w-[186px] h-[186px] md:w-[384px] md:h-[384px]',
  sm: 'w-full min-w-[168px] max-w-[283px] aspect-[168/293]',
};

// 별점 텍스트 스타일
const ratingTextStyle = {
  lg: 'text-white font-semibold text-md',
  sm: 'text-black font-medium text-lg',
};

// 리뷰 텍스트 스타일
const reviewTextStyle = {
  lg: 'text-white font-semibold text-md',
  sm: 'text-gray-600 font-medium text-lg',
};

// 제목 스타일
const titleStyle = {
  lg: 'text-white font-bold text-2lg md:text-3xl',
  sm: 'text-black font-semibold text-lg md:text-xl',
};

// 가격 스타일
const priceStyle = {
  lg: 'text-white text-lg md:text-xl',
  sm: 'text-black text-base md:text-lg',
};

// /인 단위 스타일
const unitStyle = {
  lg: 'text-white text-sm md:text-base',
  sm: 'text-gray-600 text-sm md:text-base',
};

/* 라지 카드 전용 컴포넌트 */
const LargeCard: React.FC<ExperiencesCardProps> = ({
  image,
  title,
  price,
  rating,
  reviews,
}) => (
  <div className={`relative ${cardSize.lg}`}>
    {/* 카드 이미지 */}
    <Image
      src={image}
      alt={title}
      fill
      className="object-cover rounded-[20px] overflow-hidden bg-gray-200"
      sizes="(max-width: 768px) 186px, 384px"
      priority
    />

    {/* 오버레이 이미지 */}
    <Image
      src="/images/card_cover.svg"
      alt="Card Overlay"
      fill
      className="object-cover pointer-events-none rounded-[20px]"
    />

    {/* 텍스트 영역 */}
    <div className="absolute bottom-4 left-4 right-4 md:bottom-7 md:left-6 md:right-6 flex flex-col gap-2 md:gap-4">
      <div className="flex items-center gap-1">
        <Image src="/icon/star_on.svg" alt="Star Icon" width={15} height={15} />
        <span className={ratingTextStyle.lg}>{rating.toFixed(1)}</span>
        <span className={reviewTextStyle.lg}>({reviews})</span>
      </div>

      <h3
        className={`
          ${titleStyle.lg} 
          overflow-hidden 
          -webkit-box 
          -webkit-line-clamp-2 
          -webkit-box-orient-vertical
          leading-[1.625rem] md:leading-[2.625rem]
          max-h-[3.25rem] md:max-h-[5.25rem]
          min-h-[3.25rem] md:min-h-[5.25rem]
        `}
      >
        {title}
      </h3>

      <p className={`font-bold ${priceStyle.lg}`}>
        ₩ {price.toLocaleString('ko-KR')}
        <span className={unitStyle.lg}> /인</span>
      </p>
    </div>
  </div>
);

/* 스몰 카드 전용 컴포넌트 */
const SmallCard: React.FC<ExperiencesCardProps> = ({
  image,
  title,
  price,
  rating,
  reviews,
}) => (
  <div className={`flex flex-col ${cardSize.sm}`}>
    {/* 카드 이미지 */}
    <div className="relative w-full max-w-[283px] aspect-[168/168]">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover rounded-[20px] overflow-hidden bg-gray-200"
        sizes="(max-width: 768px) 168px, (max-width: 1024px) 221px, 283px"
      />
    </div>

    {/* 텍스트 영역 */}
    <div className="flex-1 py-3 flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <Image src="/icon/star_on.svg" alt="Star Icon" width={12} height={12} />
        <span className={ratingTextStyle.sm}>{rating.toFixed(1)}</span>
        <span className={reviewTextStyle.sm}>({reviews})</span>
      </div>

      <h3
        className={`
          ${titleStyle.sm} 
          overflow-hidden 
          -webkit-box 
          -webkit-line-clamp-2 
          -webkit-box-orient-vertical
          leading-[1.625rem] md:leading-[2.625rem]
          max-h-[3.25rem] md:max-h-[5.25rem]
          min-h-[3.25rem] md:min-h-[5.25rem]
        `}
      >
        {title}
      </h3>

      <p className={`font-bold ${priceStyle.sm}`}>
        ₩ {price.toLocaleString('ko-KR')}
        <span className={unitStyle.sm}> /인</span>
      </p>
    </div>
  </div>
);

/* ExperiencesCard: Large 또는 Small 타입 중 선택 */
const ExperiencesCard: React.FC<ExperiencesCardProps> = ({
  type = 'sm',
  ...props
}) => {
  return type === 'lg' ? <LargeCard {...props} /> : <SmallCard {...props} />;
};

export default ExperiencesCard;
