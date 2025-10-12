'use client';

import React from 'react';
import Image from 'next/image';
import type { ActivityDetailInfo } from '@/types/activity';

export interface ActivityLocationProps {
  address: ActivityDetailInfo['address'];
}

const ActivityLocation: React.FC<ActivityLocationProps> = ({ address }) => {
  return (
    <div className="w-full flex flex-col gap-2">
      {/* 지도 영역 */}
      <div
        id="map"
        className="w-full h-[450px] bg-gray-200 flex items-center justify-center text-gray-500"
      >
        지도 표시
      </div>

      {/* 주소 */}
      <div className="flex items-center gap-1 text-md font-normal leading-[100%] text-black">
        <Image
          src="/icon/location.svg"
          alt="주소 아이콘"
          width={18}
          height={18}
        />
        <span className="font-semibold">주소:</span> {address}
      </div>
    </div>
  );
};

export default ActivityLocation;
