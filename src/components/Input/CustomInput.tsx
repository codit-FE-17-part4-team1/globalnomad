'use client';

import { ChangeEvent } from 'react';
import Label from './Label';

type CustomInputProps = {
  id: string;
  name: string;
  type?: 'text' | 'number';
  variant?: 'input' | 'textarea';
  labelText?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

  // 사용자 스타일 수정 prop
  wrapperClassName?: string;
  labelClassName?: string;
  labelUnstyled?: boolean; //기본 스타일 제거
  inputClassName?: string;
};

export default function CustomInput({
  id,
  name,
  type = 'text',
  variant = 'input',
  labelText,
  placeholder,
  value,
  onChange,
  wrapperClassName,
  labelClassName,
  labelUnstyled = false,
  inputClassName,
}: CustomInputProps) {
  return (
    <div className={`w-full mb-4 ${wrapperClassName || ''}`}>
      {labelText && (
        <Label
          id={id}
          text={labelText}
          className={labelClassName}
          unstyled={labelUnstyled}
        />
      )}
      {variant === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          placeholder={placeholder}
          value={value as string}
          onChange={onChange} // 수정
          // onChange={onChange as (e: ChangeEvent<HTMLTextAreaElement>) => void}
          className={`w-full px-5 py-4 rounded-md border
            border-gray-700 focus:outline-none
            min-h-[240px]
            text-lg text-black placeholder-gray-600
            resize-none
            ${inputClassName || ''}`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange} // 수정
          // onChange={onChange as (e: ChangeEvent<HTMLInputElement>) => void}
          className={`w-full px-5 py-4 rounded-md border
            border-gray-700 focus:outline-none
            text-lg text-black placeholder-gray-600
            ${inputClassName || ''}`}
        />
      )}
    </div>
  );
}
