'use client';

import React from 'react';

interface OptionSelectButtonProps {
  onClick: () => void;
  label: string;
  className?: string;
}

const OptionSelectButton: React.FC<OptionSelectButtonProps> = ({
  onClick,
  label,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      className={`text-black-nomad font-semibold text-lg hover:underline hover:text-orange focus:outline-none ${className}`}
    >
      {label}
    </button>
  );
};

export default OptionSelectButton;
