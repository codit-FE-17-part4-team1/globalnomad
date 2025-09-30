import { ChangeEvent, useState } from 'react';

export function useInputValue<T extends Record<string, string>>(initial: T) {
  const [input, setInput] = useState(initial);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return [input, handleInputChange] as const;
}
