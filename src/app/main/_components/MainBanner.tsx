'use client';

import React from 'react';
import Image from 'next/image';

const MainBanner: React.FC = () => {
  return (
    <section className="relative w-full h-[240px] md:h-[550px] flex justify-center items-center">
      {/* 배경 이미지 */}
      <Image
        src="/images/street_dance.png"
        alt="메인 배너"
        fill
        className="object-cover bg-gray-200"
        priority
      />

      {/* 오버레이 이미지 */}
      <Image
        src="/images/banner_cover.png"
        alt="배너 오버레이"
        fill
        className="object-cover"
        priority
      />

      {/* 배너 문구 */}
      <div className="max-w-[1240px] w-full px-5 text-left z-10">
        <h1 className="text-white font-bold text-[24px] md:text-[54px] lg:text-[68px] leading-[100%] text-left">
          함께 배우면 즐거운
          <br />
          스트릿 댄스
        </h1>
        <p className="mt-4 text-white font-bold text-md md:text-lg lg:text-2xl leading-[100%] text-left">
          1월의 인기 체험 BEST 🔥
        </p>
      </div>
    </section>
  );
};

export default MainBanner;
