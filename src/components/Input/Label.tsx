type LabelProps = {
  id: string;
  text: string;
};

export default function Label({ id, text }: LabelProps) {
  return (
    <label
      htmlFor={id}
      className="block mb-1 text-sm font-medium text-gray-700"
    >
      {text}
    </label>
  );
}
