import clsx from 'clsx';

type ChipsType = {
  children: React.ReactNode;
  className?: string;
  variant?: 'white' | 'blue' | 'gray' | 'orange';
};

export default function Chips({
  children,
  className,
  variant = 'white',
}: ChipsType) {
  const variantClass = {
    white: 'bg-white text-[#0085FF]',
    blue: 'bg-[#0085FF] text-white',
    gray: 'bg-[#ddd] text-[#4b4b4b]',
    orange: 'bg-p-orange-50 text-p-orange-100',
  };
  return (
    <div
      className={clsx(
        className,
        variantClass[variant],
        'text-sm font-medium w-full',
        'p-1 rounded-sm'
      )}
    >
      {children}
    </div>
  );
}
