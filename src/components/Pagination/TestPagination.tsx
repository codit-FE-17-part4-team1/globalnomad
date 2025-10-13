'use client';

import { useState } from 'react';
import Pagination from '@/components/Pagination/Pagination';

export default function TestPagination() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50 gap-6 p-4">
      <h1 className="text-2xl font-bold text-green-dark">Pagination 테스트</h1>

      <Pagination
        totalItems={42} // 총 아이템 수
        currentPage={currentPage}
        itemsPerPage={10} // 한 페이지당 아이템 수
        onPageChange={(page) => setCurrentPage(page)}
        maxPageButtons={5} // 한 번에 보여줄 페이지 버튼 수
      />

      <p className="text-gray-700">
        현재 페이지: <strong>{currentPage}</strong>
      </p>
    </div>
  );
}
