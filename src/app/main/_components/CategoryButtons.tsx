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
    <ul className="flex md:flex-nowrap overflow-x-auto scrollbar-hide mb-7">
      {categories.map((category, idx) => (
        <MyButton
          key={category}
          color={
            selectedCategory === category
              ? 'buttonCategoryActive'
              : 'buttonCategory'
          }
          onClick={() => onSelectCategory(category)}
          className={`mr-[8px] md:mr-[14px] lg:mr-[24px] w-[80px] h-[41px] md:w-[120px] md:h-[58px] lg:w-[127px] lg:h-[58px] flex-shrink-0 last:mr-0`}
        >
          {category}
        </MyButton>
      ))}
    </ul>
  );
};

export default CategoryButtons;
