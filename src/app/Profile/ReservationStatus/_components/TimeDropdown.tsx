'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

export type TimeOption = { value: string; label: string };

export default function TimeDropdown({
  value,
  options,
  onChange,
  placeholder = '예약 시간', // 이걸 해줘야 할 지 고민인데, 일단 해둠
  closeOnOverlay = true,
  closeOnEsc = true,
}: {
  value?: string;
  options: TimeOption[];
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    // 드롭다운 클릭 후에 바깥을 클릭하면 닫히도록 하고 싶음(모달 때 사용한 코드로 해볼까)
    const onDocClick = (e: MouseEvent) => {
      if (!closeOnOverlay) return;

      if (
        !btnRef.current?.contains(e.target as Node) &&
        !listRef.current?.contains(e.target as Node)
      )
        setOpen(false);
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

  const selectedLabel = options.find((o) => o.value === value)?.label ?? '';

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between rounded-md border border-[var(--color-gray-500)] px-4 py-2 text-left"
      >
        {' '}
        <span className={selectedLabel ? '' : 'text-gray-400'}>
          {' '}
          {selectedLabel || placeholder}{' '}
        </span>{' '}
        <Image
          src="/icon/btn/down_arrow.svg"
          alt="펼치기"
          width={16}
          height={16}
          className="cursor-pointer"
        />
      </button>
      {open && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute top-full left-0 z-50 mt-2 max-h-56 w-full overflow-auto rounded-md border border-[var(--color-gray-500)] bg-white shadow-lg"
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
            >
              <button
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`block w-full px-4 py-2 text-left hover:bg-[var(--color-green-light)] ${
                  opt.value === value ? 'bg-[var(--color-gray-200)]' : ''
                }`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
