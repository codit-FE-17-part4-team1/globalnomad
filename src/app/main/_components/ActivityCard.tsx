'use client';

import React from 'react';
import Image from 'next/image';
import type { Activity } from '@/types/activity';

export type ActivityCardProps = Pick<
  Activity,
  | 'bannerImageUrl'
  | 'title'
  | 'description'
  | 'price'
  | 'rating'
  | 'reviewCount'
  | 'createdAt'
> & { type?: 'sm' | 'lg'; onClick?: () => void };

// 카드 래퍼 크기
// SmallCard에서는 cardSize.sm와 imageSize.sm을 사용하지 않음 (그리드 컬럼 폭에 맞게 카드 폭을 100% 로 지정)
const cardSize = {
  lg: 'w-[186px] h-[186px] md:w-[384px] md:h-[384px]',
  //sm: 'w-full max-w-[168px] md:max-w-[221px] lg:max-w-[283px]',
};

// 이미지 크기 (라지 타입의 경우 카드 이미지 = 카드 래퍼 동일)
//const imageSize = {
//sm: 'w-full aspect-square',
//};

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
const LargeCard: React.FC<ActivityCardProps> = ({
  bannerImageUrl,
  title,
  price,
  rating,
  reviewCount,
  onClick,
}) => (
  <div className={`relative ${cardSize.lg} cursor-pointer`} onClick={onClick}>
    {/* 카드 이미지 */}
    <Image
      src={bannerImageUrl}
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
        <span className={reviewTextStyle.lg}>({reviewCount})</span>
      </div>

      <div className="flex flex-col h-[3.25rem] md:h-[5.25rem] justify-start">
        <h3 className={`${titleStyle.lg} line-clamp-2`}>{title}</h3>
      </div>

      <p className={`font-bold ${priceStyle.lg}`}>
        ₩ {price.toLocaleString('ko-KR')}
        <span className={unitStyle.lg}> /인</span>
      </p>
    </div>
  </div>
);

/* 스몰 카드 전용 컴포넌트 */
const SmallCard: React.FC<ActivityCardProps> = ({
  bannerImageUrl,
  title,
  price,
  rating,
  reviewCount,
  onClick,
}) => (
  <div className={`flex flex-col w-full cursor-pointer`} onClick={onClick}>
    {/* 카드 이미지 */}
    <div className={`relative w-full aspect-square`}>
      <Image
        src={bannerImageUrl}
        alt={title}
        fill
        className="object-cover rounded-[20px] overflow-hidden bg-gray-200"
        sizes="(max-width: 768px) 100%, (max-width: 1024px) 100%, 100%"
      />
    </div>

    {/* 텍스트 영역 */}
    <div className="flex-1 py-3 flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <Image src="/icon/star_on.svg" alt="Star Icon" width={12} height={12} />
        <span className={ratingTextStyle.sm}>{rating.toFixed(1)}</span>
        <span className={reviewTextStyle.sm}>({reviewCount})</span>
      </div>

      <div className="flex flex-col h-[3.25rem] md:h-[3.625rem] justify-start">
        <h3 className={`${titleStyle.sm} line-clamp-2`}>{title}</h3>
      </div>

      <p className={`font-bold ${priceStyle.sm}`}>
        ₩ {price.toLocaleString('ko-KR')}
        <span className={unitStyle.sm}> /인</span>
      </p>
    </div>
  </div>
);

/* ActivityCard: Large 또는 Small 타입 중 선택 */
const ActivityCard: React.FC<ActivityCardProps> = ({
  type = 'sm',
  ...props
}) => {
  return type === 'lg' ? <LargeCard {...props} /> : <SmallCard {...props} />;
};

export default ActivityCard;
