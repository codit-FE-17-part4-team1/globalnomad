import clsx from 'clsx';

type ChipsType = {
  children: React.ReactNode;
  className?: string;
  color?: 'white' | 'blue' | 'gray' | 'orange'|'red';
  variant?: 'normal' | 'round';
};

export default function Chips({
  children,
  className,
  color = 'white',
  variant = 'normal'
}: ChipsType) {
  const BaseStyle = "text-md"
  const colorClass = {
    white: 'bg-white text-blue',
    blue: 'bg-blue text-white',
    gray: 'bg-gray-200 text-gray-800',
    orange: 'bg-orange-pale text-orange',
    red : 'bg-red-pale text-red',
  };
  const variantClass ={
    normal :'p-1 rounded-sm w-full inline-block font-medium',
    round : 'rounded-3xl text-center px-3.5 py-2.5 font-bold',
  }
  return (
    <span
      className={clsx(
        className,
        BaseStyle,
        colorClass[color],
        variantClass[variant],
      )}
    >
      {children}
    </span>
  );
}
