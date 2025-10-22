'use client';

import React from 'react';
import Image from 'next/image';
import type { ActivityDetailInfo } from '@/types/activity';

export interface ImageGalleryProps {
  bannerImageUrl: ActivityDetailInfo['bannerImageUrl'];
  subImages: ActivityDetailInfo['subImages'];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  bannerImageUrl,
  subImages,
}) => {
  return (
    <div className="flex md:flex-row gap-2">
      {/* 배너 이미지(좌측 이미지) */}
      <div
        className="
          relative
          w-full
          h-[310px] md:h-[310px] lg:h-[534px]
          md:min-w-[345px] lg:max-w-[595px] 
          transition-all duration-300"
      >
        <Image
          src={bannerImageUrl}
          alt="배너 이미지"
          fill
          className="object-cover md:rounded-tl-xl md:rounded-bl-xl bg-gray-200"
        />
      </div>

      {/* 서브 이미지 */}
      <div
        className="
        hidden md:grid  
        grid-cols-2 grid-rows-2 gap-2
        w-full
        md:h-[310px] lg:h-[534px]
        md:min-w-[345px] lg:max-w-[595px]
        transition-all duration-300
        " // 모바일에서는 서브 이미지 영역을 숨김, 태블릿 이상부터 gird 로 표시됨
      >
        {subImages.slice(0, 4).map((subImage, idx) => (
          <div key={subImage.id} className="relative w-full h-full">
            <Image
              src={subImage.imageUrl}
              alt={`서브 이미지 ${idx + 1}`}
              fill
              sizes="(max-width: 1024px) 170px, 295px"
              className={`object-cover bg-gray-200 
          ${
            idx === 1
              ? 'rounded-tr-xl'
              : idx === 3
                ? 'rounded-br-xl'
                : 'rounded-none'
          }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
