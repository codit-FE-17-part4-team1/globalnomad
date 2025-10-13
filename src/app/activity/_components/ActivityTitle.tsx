'use client';

import React from 'react';
import Image from 'next/image';
import type { ActivityDetailInfo } from '@/types/activity';

export interface ActivityTitleProps {
  category: ActivityDetailInfo['category'];
  title: ActivityDetailInfo['title'];
  rating: ActivityDetailInfo['rating'];
  reviewCount: ActivityDetailInfo['reviewCount'];
  address: ActivityDetailInfo['address'];
}

const ActivityTitle: React.FC<ActivityTitleProps> = ({
  category,
  title,
  rating,
  reviewCount,
  address,
}) => {
  return (
    <div className="w-full flex flex-col gap-2">
      {/* 카테고리 */}
      <span className="text-md font-normal text-black-nomad">{category}</span>

      <div className="flex justify-between items-center">
        {/* 체험 타이틀 */}
        <h1 className="text-2xl md:text-3xl font-bold text-black-nomad whitespace-nowrap overflow-hidden truncate">
          {title}
        </h1>
        {/* 더보기 버튼 */}
        <button
          className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 transition"
          aria-label="더보기 메뉴"
        >
          <Image
            src="/icon/btn/meatball.svg"
            alt="더보기"
            width={40}
            height={40}
          />
        </button>
      </div>

      {/* 평점 + 주소 */}
      <div className="flex items-center gap-2 text-black-nomad text-md font-normal">
        {/* 평점 */}
        <div className="flex items-center gap-[6px]">
          <Image
            src="/icon/star_on.svg"
            alt="평점 아이콘"
            width={16}
            height={16}
          />
          <span>{rating.toFixed(1)}</span>
          <span>({reviewCount})</span>
        </div>

        {/* 주소 */}
        <div className="flex items-center gap-[6px] whitespace-nowrap ">
          <Image
            src="/icon/location.svg"
            alt="주소 아이콘"
            width={18}
            height={18}
          />
          <span>{address}</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityTitle;
