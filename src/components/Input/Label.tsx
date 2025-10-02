type LabelProps = {
  id: string;
  text: string;
  className?: string;
  unstyled?: boolean;
};

export default function Label({
  id,
  text,
  className = '',
  unstyled = false,
}: LabelProps) {
  return (
    <label
      htmlFor={id}
      className={
        unstyled
          ? className
          : `block mb-1 text-sm font-medium text-gray-700 ${className}`
      }
    >
      {text}
    </label>
  );
}
