'use client';

import React from 'react';

interface RecentSearchListProps {
  recentSearches: string[];
  onDelete: (query: string) => void;
  onSelect: (query: string) => void;
}

const RecentSearchList: React.FC<RecentSearchListProps> = ({
  recentSearches,
  onDelete,
  onSelect,
}) => {
  return (
    <div className="absolute top-full left-0 mt-1 w-full max-w-[1200px] bg-white rounded-xl shadow-lg z-10 max-h-[360px] overflow-y-auto">
      {recentSearches.length === 0 ? (
        <div className="px-4 py-3 text-gray-500">최근 검색어가 없습니다</div>
      ) : (
        <ul className="flex flex-col divide-y divide-gray-200">
          {recentSearches.map((item) => (
            <li
              key={item}
              className="flex justify-between items-center px-4 py-3 hover:bg-gray-50 cursor-pointer"
            >
              <div
                className="flex items-center gap-2 flex-1"
                onClick={() => onSelect(item)}
              >
                <span className="text-gray-400">⏱</span>
                <span className="text-gray-700 truncate">{item}</span>
              </div>
              <button
                onClick={() => onDelete(item)}
                className="text-gray-400 hover:text-red-500"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentSearchList;
