'use client';

import React, { useState, useEffect } from 'react';
import ExperiencesCard, { ExperiencesCardProps } from './ExperiencesCard';
import Pagination from './Pagination';
import CategoryButtons from './CategoryButtons';
import PriceFilter from './PriceFilter';

export interface Experience extends ExperiencesCardProps {
  id: number;
  category: string;
}

// 예시 체험 데이터
const experiences: Experience[] = [
  {
    id: 1,
    image: '/images/street_dance.png',
    title: '스트릿 댄스',
    category: '투어',
    price: 38000,
    rating: 4.9,
    reviews: 793,
  },
  {
    id: 2,
    image: '/images/bridge.png',
    title: '연인과 사랑의 징검다리 건너기',
    category: '투어',
    price: 5600,
    rating: 4.9,
    reviews: 593,
  },
  {
    id: 3,
    image: '/images/VR.png',
    title: 'VR 게임 마스터하는 법',
    category: '투어',
    price: 38000,
    rating: 4.9,
    reviews: 293,
  },
  {
    id: 4,
    image: '/images/street_dance.png',
    title: '함께 배우면 즐거운 스트릿 댄스',
    category: '투어',
    price: 38000,
    rating: 4.9,
    reviews: 793,
  },
  {
    id: 5,
    image: '/images/bridge.png',
    title: '연인과 사랑의 징검다리 건너기',
    category: '투어',
    price: 5600,
    rating: 4.9,
    reviews: 593,
  },
  {
    id: 6,
    image: '/images/VR.png',
    title: 'VR 게임 마스터하는 법',
    category: '투어',
    price: 38000,
    rating: 4.9,
    reviews: 293,
  },
  {
    id: 7,
    image: '/images/street_dance.png',
    title: '함께 배우면 즐거운 스트릿 댄스',
    category: '투어',
    price: 38000,
    rating: 4.9,
    reviews: 793,
  },
  {
    id: 8,
    image: '/images/bridge.png',
    title: '연인과 사랑의 징검다리 건너기',
    category: '투어',
    price: 5600,
    rating: 4.9,
    reviews: 593,
  },
  {
    id: 9,
    image: '/images/VR.png',
    title: 'VR 게임 마스터하는 법',
    category: '투어',
    price: 38000,
    rating: 4.9,
    reviews: 293,
  },
  {
    id: 10,
    image: '/images/VR.png',
    title: 'VR 게임 마스터하는 법',
    category: '투어',
    price: 38000,
    rating: 4.9,
    reviews: 293,
  },
];

const categories = [
  '전체',
  '문화,예술',
  '식음료',
  '스포츠',
  '투어',
  '관광',
  '웰빙',
];

const AllExperiences: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [visibleCards, setVisibleCards] = useState<Experience[]>([]);
  const [filteredExperiences, setFilteredExperiences] =
    useState<Experience[]>(experiences);

  const [priceSort, setPriceSort] = useState(''); // 가격 정렬 상태

  useEffect(() => {
    const savedCategory = localStorage.getItem('selectedCategory');
    const savedPage = localStorage.getItem('allExperiencesPage');
    const savedItemsPerPage = localStorage.getItem('itemsPerPage');
    const savedPriceSort = localStorage.getItem('priceSort');

    if (savedCategory) setSelectedCategory(savedCategory);
    if (savedPage) setCurrentPage(Number(savedPage));
    if (savedItemsPerPage) setItemsPerPage(Number(savedItemsPerPage));
    if (savedPriceSort) setPriceSort(savedPriceSort);
  }, []);

  // 카테고리 변경 시 필터링
  useEffect(() => {
    const filtered =
      selectedCategory === '전체'
        ? experiences
        : experiences.filter((exp) => exp.category === selectedCategory);

    setFilteredExperiences(filtered);
    setCurrentPage(1); // 카테고리 바뀌면 페이지 초기화
    localStorage.setItem('selectedCategory', selectedCategory);
  }, [selectedCategory]);

  // 가격 정렬 필터
  useEffect(() => {
    let sorted = [...filteredExperiences];
    if (priceSort === '가격이 낮은 순')
      sorted.sort((a, b) => a.price - b.price);
    else if (priceSort === '가격이 높은 순')
      sorted.sort((a, b) => b.price - a.price);

    setFilteredExperiences(sorted);
    localStorage.setItem('priceSort', priceSort);
  }, [priceSort]);

  useEffect(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    setVisibleCards(filteredExperiences.slice(startIdx, endIdx));

    localStorage.setItem('allExperiencesPage', currentPage.toString());
    localStorage.setItem('itemsPerPage', itemsPerPage.toString());
  }, [currentPage, itemsPerPage, filteredExperiences]);

  const handlePageChange = (page: number, perPage: number) => {
    setCurrentPage(page);
    setItemsPerPage(perPage);
  };

  return (
    <div className="w-full max-w-[1240px] mx-auto px-5">
      {/* 카테고리 버튼 */}
      <CategoryButtons
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className="flex justify-between items-center mb-7">
        <h2 className="text-black font-bold text-2xl lg:text-[36px] leading-[100%]">
          ⛸️ 모든 체험
        </h2>

        {/* 가격 정렬 필터 */}
        <PriceFilter selected={priceSort} setSelected={setPriceSort} />
      </div>

      {/* 카드 리스트 */}
      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {visibleCards.map((exp) => (
          <ExperiencesCard key={exp.id} {...exp} type="sm" />
        ))}
      </div>

      {/* 페이지네이션 */}
      <Pagination
        totalItems={filteredExperiences.length}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default AllExperiences;
