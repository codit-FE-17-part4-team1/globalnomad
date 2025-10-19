'use client';

import React, {
  ReactNode,
  useState,
  useRef,
  useEffect,
  useContext,
} from 'react';

const DropdownContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  selected: string;
  setSelected: (val: string) => void;
  onSelect?: (value: string) => void;
}>({
  open: false,
  setOpen: () => {},
  selected: '',
  setSelected: () => {},
  onSelect: undefined,
});

interface DropdownProps {
  children: ReactNode;
  onSelect?: (value: string) => void;
}

export default function Dropdown({ children, onSelect }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [open]);

  return (
    <DropdownContext.Provider
      value={{ open, setOpen, selected, setSelected, onSelect }}
    >
      <div ref={dropdownRef} className="relative">
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

// DropdownButton: 버튼 모양
interface DropdownButtonProps {
  children: ReactNode;
  color?:
    | 'dropdownPrimary'
    | 'dropdownSecondary'
    | 'dropdownTertiary'
    | 'dropdownSet';
  icon?: ReactNode;
}

const buttonStyles: { [key: string]: string } = {
  dropdownPrimary:
    'px-4 py-4 border border-[#79747E] text-[#a4a1aa] bg-white rounded-sm flex items-center justify-between mb-4',
  dropdownSecondary:
    'w-[127px] h-[53px] py-[13.5px] px-[20px] rounded-2xl bg-white border border-[#0b3b2d] text-[#0b3b2d] text-lg flex items-center justify-between',
  dropdownTertiary:
    'w-[160px] h-[53px] rounded-2xl bg-white border border-[#0b3b2d] text-[#0b3b2d] text-lg flex items-center justify-between px-4',
  dropdownSet: 'w-[40px] h-[40px]',
};

function DropdownButton({
  children,
  color = 'dropdownPrimary',
  icon,
}: DropdownButtonProps) {
  const { open, setOpen, selected } = useContext(DropdownContext);

  const renderIcon = () => {
    if (color === 'dropdownPrimary') {
      return (
        <svg
          fill="none"
          viewBox="0 0 24 24"
          width={15}
          height={15}
          strokeWidth={2}
          stroke="currentColor"
          className={`ml-2 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'} text-[#1b1b1b]`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      );
    } else if (color === 'dropdownSecondary' || color === 'dropdownTertiary') {
      return (
        <svg
          width={10}
          height={10}
          viewBox="0 0 10 10"
          className={`ml-2 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`}
        >
          <polygon points="0,0 10,0 5,10" fill="currentColor" />
        </svg>
      );
    } else {
      return null;
    }
  };

  return (
    <div className={buttonStyles[color]} onClick={() => setOpen(!open)}>
      <div className="flex items-center gap-2">
        {icon && <span className="w-5 h-5 relative">{icon}</span>}
        <span>
          {color === 'dropdownPrimary' ? selected || children : children}
        </span>
      </div>
      {renderIcon()}
    </div>
  );
}

// DropdownContent: 버튼 클릭시 나오는 드롭다운의 전체틀
interface DropdownContentProps {
  children: ReactNode;
  color?:
    | 'dropdownPrimary'
    | 'dropdownSecondary'
    | 'dropdownTertiary'
    | 'dropdownSet';
}

// className prop 추가
function DropdownContent({
  children,
  color = 'dropdownPrimary',
  className,
}: DropdownContentProps & { className?: string }) {
  const { open } = useContext(DropdownContext);

  const baseClass = 'absolute z-20 rounded bg-white';
  const addClass = {
    dropdownPrimary: 'w-[100%] p-[8px] shadow-lg',
    dropdownSecondary: 'w-[127px] border border-[#ddd]',
    dropdownTertiary: 'w-[160px] border border-[#ddd]',
    dropdownSet: 'border border-[#ddd]',
  }[color];

  return open ? (
    <div className={`${baseClass} ${addClass} ${className ?? ''}`}>
      {children}
    </div>
  ) : null;
}

// DropdownItem: 버튼 클릭시 나오는 드롭다운의 내용물들
interface DropdownItemProps {
  value: string;
  children: ReactNode;
  color?:
    | 'dropdownPrimary'
    | 'dropdownSecondary'
    | 'dropdownTertiary'
    | 'dropdownSet';
}

function DropdownItem({
  value,
  children,
  color = 'dropdownPrimary',
}: DropdownItemProps) {
  const { setSelected, setOpen, onSelect } = useContext(DropdownContext);

  const handleClick = () => {
    if (color === 'dropdownPrimary') {
      setSelected(value);
    }
    onSelect?.(value);
    setOpen(false);
  };

  if (color === 'dropdownPrimary') {
    return (
      <button
        onClick={handleClick}
        className="group relative py-2 px-4 hover:bg-black-nomad hover:text-white w-full text-left rounded-md flex items-center"
      >
        <span className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </span>
        <span className="flex-1">{children}</span>
      </button>
    );
  } else {
    return (
      <button
        onClick={handleClick}
        className="group relative border-b last:border-b-0 py-[16px] border-[#ddd] hover:bg-[#ddd] hover:text-white w-full text-center flex text-lg"
      >
        <span className="flex-1">{children}</span>
      </button>
    );
  }
}

Dropdown.Button = DropdownButton;
Dropdown.Content = DropdownContent;
Dropdown.Item = DropdownItem;
