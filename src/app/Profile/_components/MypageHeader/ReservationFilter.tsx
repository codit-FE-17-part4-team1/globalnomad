'use client';

import React from 'react';
import Dropdown from '@/components/Dropdown/Dropdown';

type SelectedType = {
  selected?: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  selectList?: string[];
};

export default function ReservationFilter({
  selected,
  setSelected,
  selectList,
}: SelectedType) {
  return (
    <Dropdown>
      <Dropdown.Button color="dropdownTertiary">
        {selected || '선택'}
      </Dropdown.Button>
      <Dropdown.Content color="dropdownTertiary">
        {selectList?.map((list) => {
          return (
            <div onClick={() => setSelected(list)} key={list}>
              <Dropdown.Item color="dropdownTertiary" value={list}>
                {list}
              </Dropdown.Item>
            </div>
          );
        })}
      </Dropdown.Content>
    </Dropdown>
  );
}
