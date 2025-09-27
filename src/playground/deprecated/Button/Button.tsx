// src/components/ui/button/button.tsx
import React from 'react';

type ButtonProps = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  backgroundColor?: 'green';
  children: React.ReactNode;
  variant: string;
};

export default function Button({
  label,
  onClick,
  disabled,
  backgroundColor = 'green',
  children,
  variant,
}: ButtonProps) {
  const base = 'px-4 py-2 rounded disabled:opacity-50 font-bold';

  const bgClass =
    backgroundColor === 'green'
      ? 'bg-[var(--color-green-dark)] text-white'
      : 'bg-white text-gray-800 border';
  return (
    <button
      className="rounded bg-[var(--color-green-dark)] px-4 py-2 text-white disabled:opacity-50"
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
