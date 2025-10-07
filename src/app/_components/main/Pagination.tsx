'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface PaginationProps {
  totalItems: number;
  onPageChange: (page: number, itemsPerPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  onPageChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // 화면 크기에 따라 itemsPerPage 조정
  const updateItemsPerPage = () => {
    if (window.innerWidth < 768)
      setItemsPerPage(4); // 모바일
    else if (window.innerWidth < 1024)
      setItemsPerPage(9); // 태블릿
    else setItemsPerPage(8); // PC
  };

  useEffect(() => {
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  // 로컬 스토리지에서 페이지 불러오기
  useEffect(() => {
    const savedPage = localStorage.getItem('allExperiencesPage');
    if (savedPage) setCurrentPage(Number(savedPage));
  }, []);

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const handlePageClick = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    localStorage.setItem('allExperiencesPage', page.toString());
    onPageChange(page, itemsPerPage);
  };

  return (
    <div className="flex justify-center gap-2 mt-6">
      {/* 이전 버튼 */}
      <button
        className={`w-[55px] h-[55px] p-3 rounded-xl border flex items-center justify-center ${
          currentPage <= 1
            ? 'bg-white border-gray-200 cursor-not-allowed'
            : 'bg-white border-green-dark'
        }`}
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <Image
          src="/icon/btn/alt_arrow_left.svg"
          alt="이전"
          width={20}
          height={20}
          className={currentPage === 1 ? 'opacity-50' : ''}
        />
      </button>

      {/* 페이징 버튼 */}
      {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
        <button
          key={page}
          className={`w-[55px] h-[55px] p-3 rounded-xl border ${
            page === currentPage
              ? 'bg-green-dark text-white border-green-dark'
              : 'bg-white text-green-dark border-green-dark'
          }`}
          onClick={() => handlePageClick(page)}
        >
          {page}
        </button>
      ))}

      {/* 다음 버튼 */}
      <button
        className={`w-[55px] h-[55px] p-3 rounded-xl border flex items-center justify-center ${
          currentPage === totalPages
            ? 'bg-white border-gray-200 cursor-not-allowed'
            : 'bg-white border-green-dark'
        }`}
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <Image
          src="/icon/btn/alt_arrow_right.svg"
          alt="다음"
          width={20}
          height={20}
          className={currentPage === totalPages ? 'opacity-50' : ''}
        />
      </button>
    </div>
  );
};

export default Pagination;
