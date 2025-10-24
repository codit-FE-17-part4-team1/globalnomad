'use client';

import React from 'react';

interface SortOptionsProps {
  sortOption: 'relevance' | 'latest';
  onSortChange: (option: 'relevance' | 'latest') => void;
}

const SortOptions: React.FC<SortOptionsProps> = ({
  sortOption,
  onSortChange,
}) => {
  return (
    <div className="flex items-center gap-4">
      <button
        className={`text-lg font-semibold ${sortOption === 'relevance' ? 'text-black' : 'text-gray-600'}`}
        onClick={() => onSortChange('relevance')}
      >
        <span className="mr-1">•</span>관련도순
      </button>
      <button
        className={`text-lg font-semibold ${sortOption === 'latest' ? 'text-black' : 'text-gray-600'}`}
        onClick={() => onSortChange('latest')}
      >
        <span className="mr-1">•</span>최신순
      </button>
    </div>
  );
};

export default SortOptions;
