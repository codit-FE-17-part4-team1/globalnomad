'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ExperiencesCard, { ExperiencesCardProps } from './ExperiencesCard';

interface Experience extends ExperiencesCardProps {
  id: number;
}

// 예시 데이터
const experiences: Experience[] = [
  {
    id: 1,
    image: '/images/street_dance.png',
    title: '스트릿 댄스',
    price: 38000,
    rating: 4.9,
    reviews: 793,
  },
  {
    id: 2,
    image: '/images/bridge.png',
    title: '연인과 사랑의 징검다리 건너기',
    price: 5600,
    rating: 4.9,
    reviews: 593,
  },
  {
    id: 3,
    image: '/images/VR.png',
    title: 'VR 게임 마스터하는 법',
    price: 38000,
    rating: 4.9,
    reviews: 293,
  },
  {
    id: 4,
    image: '/images/street_dance.png',
    title: '함께 배우면 즐거운 스트릿 댄스',
    price: 38000,
    rating: 4.9,
    reviews: 793,
  },
  {
    id: 5,
    image: '/images/bridge.png',
    title: '연인과 사랑의 징검다리 건너기',
    price: 5600,
    rating: 4.9,
    reviews: 593,
  },
  {
    id: 6,
    image: '/images/VR.png',
    title: 'VR 게임 마스터하는 법',
    price: 38000,
    rating: 4.9,
    reviews: 293,
  },
  {
    id: 7,
    image: '/images/street_dance.png',
    title: '함께 배우면 즐거운 스트릿 댄스',
    price: 38000,
    rating: 4.9,
    reviews: 793,
  },
  {
    id: 8,
    image: '/images/bridge.png',
    title: '연인과 사랑의 징검다리 건너기',
    price: 5600,
    rating: 4.9,
    reviews: 593,
  },
  {
    id: 9,
    image: '/images/VR.png',
    title: 'VR 게임 마스터하는 법',
    price: 38000,
    rating: 4.9,
    reviews: 293,
  },
];

const PopularExperiences: React.FC = () => {
  const topExperiences = experiences
    .sort((a, b) =>
      b.rating === a.rating ? b.reviews - a.reviews : b.rating - a.rating
    )
    .slice(0, 9);

  // PC 페이징 상태
  const [page, setPage] = useState(0);
  const cardsPerPage = 3;
  const totalPages = Math.ceil(topExperiences.length / cardsPerPage);

  const handlePrev = () => {
    if (page > 0) setPage((prev) => prev - 1);
  };
  const handleNext = () => {
    if (page < totalPages - 1) setPage((prev) => prev + 1);
  };

  const startIndex = page * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentCards = topExperiences.slice(startIndex, endIndex);

  // 브라우저 크기 상태
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const displayedCards = isDesktop ? currentCards : topExperiences;

  return (
    <div className="w-full max-w-[1240px] mx-auto px-5">
      {/* 타이틀 + 좌우 페이징 버튼 */}
      <div className="flex justify-between mb-7">
        <h2 className="text-black font-bold text-2xl lg:text-[36px] leading-[100%]">
          🔥 인기 체험
        </h2>

        {/* PC: 좌우 페이징 버튼 */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={handlePrev}
            disabled={page === 0}
            className={`${page === 0 ? 'cursor-not-allowed' : ''}`}
          >
            <Image
              src={
                page === 0
                  ? '/icon/btn/left_default.svg'
                  : '/icon/btn/left_variant.svg'
              }
              alt="Prev"
              width={48}
              height={48}
            />
          </button>
          <button
            onClick={handleNext}
            disabled={page >= totalPages - 1}
            className={`${page >= totalPages - 1 ? 'cursor-not-allowed' : ''}`}
          >
            <Image
              src={
                page >= totalPages - 1
                  ? '/icon/btn/right_default.svg'
                  : '/icon/btn/right_variant.svg'
              }
              alt="Next"
              width={48}
              height={48}
            />
          </button>
        </div>
      </div>

      {/* 카드 영역 */}
      <div className="flex overflow-x-auto gap-4 lg:overflow-hidden lg:flex-nowrap no-scrollbar lg:justify-between">
        {displayedCards.map((exp) => (
          <div key={exp.id}>
            <ExperiencesCard {...exp} type="lg" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularExperiences;
