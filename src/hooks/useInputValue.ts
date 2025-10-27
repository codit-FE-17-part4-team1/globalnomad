//Input 값 한 객체로 관리
import { ChangeEvent, useState } from 'react';

export function useInputValue<T extends Record<string, string>>(initial: T) {
  const [input, setInput] = useState(initial);

  function handleInputChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> // 수정 HTMLTextAreaElement 추가
  ) {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return [input, setInput, handleInputChange] as const;
}
