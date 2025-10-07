'use client';

import React from 'react';
import Dropdown from '@/components/Dropdown/Dropdown';

interface PriceFilterProps {
  selected: string;
  setSelected: (val: string) => void;
}

const PriceFilter: React.FC<PriceFilterProps> = ({ selected, setSelected }) => {
  return (
    <Dropdown>
      <Dropdown.Button color="dropdownSecondary">
        {selected || '가격'}
      </Dropdown.Button>
      <Dropdown.Content color="dropdownSecondary">
        <div onClick={() => setSelected('가격이 낮은 순')}>
          <Dropdown.Item color="dropdownSecondary" value="가격이 낮은 순">
            가격이 낮은 순
          </Dropdown.Item>
        </div>
        <div onClick={() => setSelected('가격이 높은 순')}>
          <Dropdown.Item color="dropdownSecondary" value="가격이 높은 순">
            가격이 높은 순
          </Dropdown.Item>
        </div>
      </Dropdown.Content>
    </Dropdown>
  );
};

export default PriceFilter;
