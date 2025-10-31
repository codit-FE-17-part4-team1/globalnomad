'use client';

import { ReactNode } from 'react';

interface MyButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  color?:
    | 'buttonPrimary'
    | 'buttonSecondary'
    | 'buttonCategory'
    | 'buttonCategoryActive'
    | 'buttonTransparent';
  disabled?: boolean;
}

export default function MyButton({
  children,
  onClick,
  className = '',
  color = 'buttonPrimary',
  disabled = false,
}: MyButtonProps) {
  const colorClasses = {
    buttonPrimary:
      'bg-orange-dark text-white border border-orange-dark rounded-lg text-lg font-bold hover:bg-orange-light hover:text-orange-dark',
    buttonSecondary:
      'bg-white text-black-nomad border border-orange-dark rounded-lg text-lg font-bold hover:bg-orange-light',
    buttonCategory:
      'bg-white text-black-nomad border border-orange-dark rounded-lg text-lg font-medium hover:bg-orange-light hover:text-orange-dark',
    buttonCategoryActive:
      'bg-orange-dark text-white border border-orange-dark rounded-lg text-lg font-medium',
    buttonTransparent: 'bg-transparent',
  };

  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={disabled}
      className={`${className} ${colorClasses[color]}
         disabled:bg-gray-500 disabled:border disabled:border-gray-500 disabled:text-white disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}
