'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

// 배너 이미지 리스트
const banners = [
  {
    bg: '/images/street_dance_2.png',
    cover: '/images/banner_cover.png',
    title: '함께 배우면 즐거운\n스트릿 댄스',
    subtitle: '리듬에 몸을 맡겨, 자유를 느껴봐 🎧',
  },
  {
    bg: '/images/yoga.jpg',
    cover: '/images/banner_cover.png',
    title: '불교 의식과 요가수업\n체험하기',
    subtitle: '마음의 평화를 찾는 시간 🌿',
  },
  {
    bg: '/images/hanbok.jpg',
    cover: '/images/banner_cover.png',
    title: '궁전에서 한복입고\n사진 촬영하기',
    subtitle: '전통의 아름다움 속으로 타임슬립 📸',
  },
];

const MainBanner: React.FC = () => {
  const [banner, setBanner] = useState(banners[0]); // SSR 시엔 항상 동일한 기본값

  useEffect(() => {
    // 클라이언트에서만 랜덤 배너 선택
    const randomIndex = Math.floor(Math.random() * banners.length);
    setBanner(banners[randomIndex]);
  }, []);

  return (
    <section className="relative w-full h-[240px] md:h-[550px] flex justify-center items-center">
      {/* 배경 이미지 */}
      <Image
        src={banner.bg}
        alt="메인 배너"
        fill
        className="object-cover bg-gray-200"
        priority
      />

      {/* 오버레이 이미지 */}
      <Image
        src={banner.cover}
        alt="배너 오버레이"
        fill
        className="object-cover"
        priority
      />

      {/* 배너 문구 */}
      <div className="max-w-[1240px] w-full px-5 text-left z-10">
        <h1 className="whitespace-pre-line text-white font-bold text-[24px] md:text-[54px] lg:text-[68px] leading-[100%] text-left">
          {banner.title}
        </h1>
        <p className="mt-4 text-white font-bold text-md md:text-lg lg:text-2xl leading-[100%] text-left">
          {banner.subtitle}
        </p>
      </div>
    </section>
  );
};

export default MainBanner;
