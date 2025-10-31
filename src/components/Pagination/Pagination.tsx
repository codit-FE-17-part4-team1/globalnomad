'use client';

import React from 'react';
import Image from 'next/image';

interface PaginationProps {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  maxPageButtons?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  currentPage,
  itemsPerPage,
  onPageChange,
  maxPageButtons = 5,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // 페이지 그룹 계산 (ex. 1~5, 6~10 ...)
  const groupIndex = Math.floor((currentPage - 1) / maxPageButtons);
  const startPage = groupIndex * maxPageButtons + 1;
  const endPage = Math.min(startPage + maxPageButtons - 1, totalPages);
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  const handlePageClick = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  return (
    <div className="flex justify-center gap-2 mt-6">
      {/* 이전 버튼 */}
      <button
        className={`md:w-[55px] md:h-[55px] w-[40px] h-[40px] p-3 rounded-[15px] md:rounded-xl border flex items-center justify-center ${
          currentPage <= 1
            ? 'bg-white border-gray-400 cursor-not-allowed'
            : 'bg-white border-gray-400 hover:border-orange-dark'
        }`}
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <Image
          src="/icon/btn/alt_arrow_right.svg"
          alt="이전"
          width={20}
          height={20}
          className={`rotate-180 ${currentPage === 1 ? 'opacity-50' : ''}`}
        />
      </button>

      {/* 페이지 번호 버튼 */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          className={`md:w-[55px] md:h-[55px] w-[40px] h-[40px] p-3 rounded-[15px] md:rounded-xl border flex items-center justify-center ${
            page === currentPage
              ? 'bg-orange-dark text-white border-orange-dark'
              : 'bg-white text-black border-gray-400 hover:border-orange-dark'
          }`}
        >
          {page}
        </button>
      ))}

      {/* 다음 버튼 */}
      <button
        className={`md:w-[55px] md:h-[55px] w-[40px] h-[40px] p-3 rounded-[15px] md:rounded-xl border flex items-center justify-center ${
          currentPage >= totalPages
            ? 'bg-white border-gray-400 cursor-not-allowed'
            : 'bg-white border-gray-400 hover:border-orange-dark'
        }`}
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage >= totalPages}
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
