'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import type { Activity } from '@/types/api/myactivities';

// 이건 유저가 선택을 해야 하는 컴포넌트라서 prop으로 타이틀만 받으면 안될 듯, prop으로 다 받아야 선택이 가능함 (선택된 항목, 여러 항목 등?)
// 여기도 closeOnOverlay, closeOnEsc 활용해보려고 함
interface ExperienceSelectProps {
  experiences: Activity[];
  selectedExperienceId?: number;
  onSelectExperience: (id: number) => void;
  label?: string;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
}

export default function ExperienceSelect({
  experiences,
  selectedExperienceId,
  onSelectExperience,
  label = '체험명',
  closeOnOverlay = true,
  closeOnEsc = true,
}: ExperienceSelectProps) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!closeOnOverlay) return;

      if (
        !btnRef.current?.contains(e.target as Node) &&
        !listRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (!closeOnEsc) return;
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [closeOnOverlay, closeOnEsc]);

  return (
    <div className="flex flex-col w-full mb-6 mt-2 relative">
      {/* 라벨이 보더 사이? 위? 에 위치해야 함 */}
      <label
        className="
          absolute -top-2 left-3
          px-1 text-sm font-medium text-[var(--color-gray-800)]
          bg-white
        "
      >
        {label}
      </label>

      {/* 여기를 FormInput 을 써도 되려나 */}
      <button
        ref={btnRef}
        type="button"
        // onClick={handleOverLayClick}
        onClick={() => setOpen((v) => !v)}
        className="w-full rounded-md border px-4 py-4 text-left border-gray-500 bg-white text-[var(--color-gray-800)] flex items-center justify-between"
      >
        <span className="truncate">
          {experiences.find((exp) => exp.id === selectedExperienceId)?.title ||
            '체험명 선택'}
        </span>
        <Image
          src="/icon/btn/down_arrow.svg"
          alt="펼치기"
          width={16}
          height={16}
          className="cousor-pointer"
        />
      </button>

      {/* 리스트를 버튼 아래로 내리고 싶음 */}

      {open && (
        <ul
          ref={listRef}
          className="absolute top-full left-0 mt-1 w-full z-50
            max-h-64 overflow-auto rounded-md border border-gray-200
            bg-white shadow-lg"
        >
          {experiences.length === 0 && (
            <li className="px-4 py-3 text-[var(--color-gray-600)]">
              체험명이 없습니다.
            </li>
          )}
          {experiences.map((exp) => (
            <li key={exp.id}>
              <button
                type="button"
                onClick={() => {
                  onSelectExperience(exp.id);
                  setOpen(false);
                }}
                className={`
                  w-full text-left px-4 py-3 border-b-[var(--color-gray-800)]
                  hover:bg-[var(--color-green-light)] hover:text-black
                  ${exp.id === selectedExperienceId ? 'bg-[var(--color-gray-200)]' : ''}
                `}
                role="option"
                aria-selected={exp.id === selectedExperienceId} // 접근성을 위함 (자동 생성되어 확인해봄)
              >
                {exp.title}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* select를 쓰게 되면 커스텀이 안되는 듯 */}
      {/* <select
        value={selectedExperience}
        onChange={(e) => onSelectExperience(e.target.value)}
        className="border border-[var(--color-gray-800)] rounded-sm px-4 py-4 text-[var(--color-gray-800)] bg-white "
      >
        {experiences.map((exp) => (
          <option key={exp} value={exp}>
            {exp}
          </option>
        ))}
      </select> */}
    </div>
  );
}
