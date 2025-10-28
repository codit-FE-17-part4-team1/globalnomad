'use client';

import React from 'react';
import Image from 'next/image';
import MoreDropdown from './MoreDropdown';
import { useRouter } from 'next/navigation';

import type { ActivityDetailInfo } from '@/types/activity';

export interface ActivityTitleProps {
  id: ActivityDetailInfo['id'];
  category: ActivityDetailInfo['category'];
  title: ActivityDetailInfo['title'];
  rating: ActivityDetailInfo['rating'];
  reviewCount: ActivityDetailInfo['reviewCount'];
  address: ActivityDetailInfo['address'];
}

const ActivityTitle: React.FC<ActivityTitleProps> = ({
  id,
  category,
  title,
  rating,
  reviewCount,
  address,
}) => {
  const router = useRouter();

  // 삭제 후 목록 페이지로 이동하고 목록 데이터를 새로고침하여 콜백한다
  const handleDeleted = () => {
    router.push('/'); // 목록(메인) 페이지로 이동
    router.refresh(); // 서버 데이터 새로 fetch
  };

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
        <MoreDropdown activityId={id} onDeleted={handleDeleted} />
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
