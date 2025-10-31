'use client';
import React, { useState, useRef, useEffect } from 'react';

interface PriceFilterProps {
  selected: string;
  setSelected: (val: string) => void;
}

// 드롭다운 옵션
const options: string[] = ['가격 낮은 순', '가격 높은 순'];

const PriceFilter: React.FC<PriceFilterProps> = ({ selected, setSelected }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [buttonWidth, setButtonWidth] = useState<number>(0);

  // 버튼 폭 계산
  useEffect(() => {
    if (buttonRef.current) {
      setButtonWidth(buttonRef.current.offsetWidth);
    }
  }, [selected]);

  const handleOptionClick = (option: string) => {
    setSelected(option);
    setIsOpen(false);
  };

  const handleReset = () => {
    setSelected('');
  };

  return (
    <div className="flex items-center gap-[2px] relative">
      {/* 드롭다운 버튼 */}
      <button
        ref={buttonRef}
        className={`
          flex justify-between items-center 
          min-w-[90px] h-[41px] text-md        
          md:min-w-[120px] md:h-[53px] md:text-2lg
          lg:min-w-[127px] lg:h-[53px]    
          font-medium px-[20px] py-[16px] transition-colors whitespace-nowrap
          ${selected ? 'bg-orange-light border border-orange-light rounded-l-[15px] text-orange-dark' : 'bg-white border border-gray-400 rounded-[15px] text-black'}
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected || '가격'}
        <span className="ml-2 text-[13px] leading-none">▼</span>
      </button>

      {/* 필터 리셋 X 버튼 */}
      {selected && (
        <button
          className={`
            w-[53px] 
            h-[41px] md:h-[53px] lg:h-[53px]   
            flex justify-center items-center bg-orange-light text-2lg font-medium text-orange-dark border border-orange-light rounded-r-[15px]
          `}
          onClick={handleReset}
        >
          ✕
        </button>
      )}

      {/* 드롭다운 리스트 */}
      {isOpen && (
        <div
          className="absolute top-full mt-1 text-md md:text-2lg font-medium text-gray-800 bg-white border border-gray-200 rounded-[6px] shadow-lg z-10 flex flex-col left-0"
          style={{ width: `${buttonWidth}px` }}
        >
          {options.map((opt, idx) => (
            <div
              key={opt}
              className={`
                w-full h-[41px] md:h-[58px] md:py-[16px] border-t border-gray-200
                flex justify-center items-center
                cursor-pointer
                whitespace-nowrap
                ${idx === 0 ? 'rounded-t-[6px]' : ''}
                ${idx === options.length - 1 ? 'rounded-b-[6px]' : ''}
                ${opt === selected ? 'bg-orange-light text-orange-dark' : 'hover:bg-gray-200'}
              `}
              onClick={() => handleOptionClick(opt)}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PriceFilter;
