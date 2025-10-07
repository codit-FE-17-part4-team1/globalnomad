'use client';

import React from 'react';
import MyButton from '@/components/Button/Button';

interface CategoryButtonsProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryButtons: React.FC<CategoryButtonsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex overflow-x-auto no-scrollbar mb-6">
      {categories.map((category, idx) => (
        <MyButton
          key={category}
          color={
            selectedCategory === category
              ? 'buttonCategoryActive'
              : 'buttonCategory'
          }
          onClick={() => onSelectCategory(category)}
          className={`mr-[24px] w-[127px] h-[58px] ${idx === categories.length - 1 ? '' : ''}`}
        >
          {category}
        </MyButton>
      ))}
    </div>
  );
};

export default CategoryButtons;
